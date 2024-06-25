package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type ColorService struct {
}

func (m *ColorService) SelectColors(q *models.Query) ([]*models.Color, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ColorsBadRequest()
	}

	// def query
	table := query.Color
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// run query
	colors, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return colors, nil
}

func (m *ColorService) AggregationColors(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Color
	aggregate := []*models.AggregateData{}

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
