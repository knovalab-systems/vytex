package services

import (
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
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

	// run query
	roles, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return roles, nil
}
