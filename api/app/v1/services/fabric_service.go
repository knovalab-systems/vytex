package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type FabricService struct {
}

func (m *FabricService) SelectFabrics(q *models.Query) ([]*models.FabricV, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.FabricBadRequest()
	}

	// def query
	table := query.FabricV
	table2 := table.As("u2")
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// def subquery
	subQuery := table.Unscoped().
		Group(table.FabricId).
		Select(table.FabricId, table.CreatedAt.Max().As("created_at_max")).
		As("u2")

	// run query
	fabrics, err := s.Unscoped().Preload(table.Fabric.Color).Preload(table.Fabric).
		LeftJoin(subQuery, table2.FabricId.EqCol(table.FabricId)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}
