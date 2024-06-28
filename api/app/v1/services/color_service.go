package services

import (
	"regexp"
	"strings"

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
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		re := regexp.MustCompile(`[\[\]]`)
		countArr := strings.Split(re.ReplaceAllString(q.Count, ""), ",")
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
