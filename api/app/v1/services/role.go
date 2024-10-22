package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

type RoleService struct {
}

func (m *RoleService) SelectRoles(q *models.Query) ([]*models.Role, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Role
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.RoleFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.RoleFilters(s, q.Filter)
		if err != nil {
			return nil, problems.RoleBadRequest()
		}
	}

	// run query
	roles, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return roles, nil
}

func (m *RoleService) SelectRole(q *models.RoleRead) (*models.Role, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Role
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.RoleFields(s, q.Fields)
	}

	// run query
	role, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return role, nil
}

func (m *RoleService) AggregationRoles(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	s := query.Role.Unscoped()
	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountRol(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.RoleSwitch(groupByArr, func(s string) bool { return false })
		err := s.Select(append(groupBy, count...)...).Group(groupBy...).Scan(a)
		if err != nil {
			return nil, problems.ServerError()
		}
		aggregate.AdjustSubfix(a, countArr)
		return a, nil
	}

	b := map[string]interface{}{}
	err := s.Select(count...).Scan(&b)
	if err != nil {
		return nil, problems.ServerError()
	}
	*a = append(*a, b)
	aggregate.AdjustSubfix(a, countArr)
	return a, nil

}

func (m *RoleService) CreateRole(b *models.RoleCreateBody) (*models.Role, error) {

	for _, v := range b.Policies {
		policy := models.Policy(v)
		if !policy.Valid() {
			return nil, problems.CreateRoleBadRequest()
		}
	}

	role := &models.Role{
		Name:     b.Name,
		Policies: b.Policies,
	}

	err := query.Role.Create(role)
	if err != nil {
		return nil, err
	}

	return role, nil
}

func (m *RoleService) UpdateRole(b *models.RoleUpdateBody) (*models.Role, error) {

	table := query.Role

	role, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	if role.Code != "" {
		return nil, problems.ReadAccess()
	}

	if b.Name != "" {
		role.Name = b.Name
	}

	if len(b.Policies) != 0 {
		for _, v := range b.Policies {
			policy := models.Policy(v)
			if !policy.Valid() {
				return nil, problems.UpdateRoleBadRequest()
			}
		}
		role.Policies = b.Policies
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(role)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	return role, nil
}
