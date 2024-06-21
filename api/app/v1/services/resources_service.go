package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type ResourceService struct {
}

func (m *ResourceService) SelectResources(q *models.Query) ([]*models.Resource, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ResourcesBadRequest()
	}

	// def query
	table := query.Resource
	table2 := table.As("table2")
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// def subquery
	subQuery := table.Unscoped().
		Group(table.Key).
		Select(table.Key, table.CreatedAt.Max().As("created_at_max")).
		As("table2")

	// run query
	resources, err := s.Unscoped().LeftJoin(subQuery, table2.Key.EqCol(table.Key)).
		Where(field.NewInt64("table2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return resources, nil
}
