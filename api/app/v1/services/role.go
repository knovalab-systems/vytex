package services

import (
	"strings"

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

func (m *RoleService) AggregationRoles(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Role
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		countArr := strings.Split(q.Count, ",")
		countObj := make(map[string]int64)

		for _, v := range countArr {
			switch v {
			case "id":
				count, err := s.Select(table.ID).Count()
				if err != nil {
					return nil, problems.ServerError()
				}
				countObj["id"] = count
			default:

				if aggregateElem.Count == nil {
					count, err := s.Count()
					if err != nil {
						return nil, problems.ServerError()
					}
					aggregateElem.Count = count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil
}
