package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type FabricService struct {
}

func (m *FabricService) SelectFabrics(q *models.Query) ([]*models.Fabric, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.FabricBadRequest()
	}

	// def query
	table := query.Fabric
	table2 := table.As("u2")
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// def subquery
	subQuery := table.Unscoped().
		Group(table.Key).
		Select(table.Key, table.CreatedAt.Max().As("created_at_max")).
		As("u2")

	// run query
	fabrics, err := s.Unscoped().LeftJoin(subQuery, table2.Key.EqCol(table.Key)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Preload(table.Color).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}

func (m *FabricService) AggregationFabrics(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Fabric
	var aggregate []*models.AggregateData

	if q.Count != "" {
		count, err := table.Unscoped().Count()
		if err != nil {
			return nil, problems.ServerError()
		}
		aggCount := &models.AggregateData{Count: count}
		aggregate = append(aggregate, aggCount)
	}

	return aggregate, nil
}
