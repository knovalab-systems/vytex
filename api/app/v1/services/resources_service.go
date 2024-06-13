package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type ResourceService struct {
}

func (m *ResourceService) SelectResources(q *models.Query) ([]*models.ResourceV, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ResourcesBadRequest()
	}

	// def query
	table := query.ResourceV
	table2 := table.As("u2")
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// def subquery
	subQuery := table.
		Group(table.ResourceId).
		Select(table.ResourceId, table.CreatedAt.Max().As("created_at_max")).
		As("u2")

	// run query
	resources, err := s.Unscoped().Preload(table.Resource.Color).Preload(table.Resource).
		LeftJoin(subQuery, table2.ResourceId.EqCol(table.ResourceId)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return resources, nil
}
