package services

import (
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gen/field"
	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) SelectUsers(q *models.Query) ([]*models.User, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.User
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.UserFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.UserFilters(s, q.Filter)
		if err != nil {
			return nil, problems.UsersBadRequest()
		}
	}

	// run query
	users, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return users, nil
}

func (m *UserService) SelectUser(q *models.UserRead) (*models.User, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.User
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.UserFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.UserFilters(s, q.Filter)
		if err != nil {
			return nil, problems.UsersBadRequest()
		}
	}

	// run query
	user, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return user, nil
}

func (m *UserService) AggregationUsers(q *models.AggregateQuery) (a []*models.AggregateData, err error) {
	s := query.User.Unscoped()
	groupBy := []field.Expr{}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy = fields.UserSwitch(groupByArr, func(s string) bool { return false })
	}

	// filters
	if q.Filter != "" {
		s, err = filters.UserFilters(s, q.Filter)
		if err != nil {
			return nil, problems.UsersBadRequest()
		}
	}

	if q.Count != "" {
		var aggregateElems []*models.AggregateData
		countArr := strings.Split(q.Count, ",")
		if len(groupBy) == 0 {
			aggregateElems, err = aggregate.CountUsers(s, countArr)
		} else {
			aggregateElems, err = aggregate.CountUsersGroupBy(s, countArr, groupBy)
		}
		if err != nil {
			return nil, err
		}
		a = append(a, aggregateElems...)
	}

	return
}

func (m *UserService) UpdateUser(b *models.UserUpdateBody) (*models.User, error) {
	table := query.User

	if b.Username != "" {
		err := helpers.CheckUsername(b.Username)
		if err != nil {
			return nil, err
		}
	}

	updateMap, err := formats.UserUpdateMap(b)
	if err != nil || len(updateMap) == 0 {
		return nil, problems.UpdateUserBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	user, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}

func (m *UserService) CreateUser(b *models.UserCreateBody) (*models.User, error) {
	// check user existence
	err := helpers.CheckUsername(b.Username)
	if err != nil {
		return nil, err
	}

	// encrypt password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(b.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, problems.ServerError()
	}

	user := &models.User{
		Username: b.Username,
		Name:     b.Name,
		Password: string(hashedPassword),
		RoleId:   b.Role,
	}

	err = query.User.Create(user)
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}
