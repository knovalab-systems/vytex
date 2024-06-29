package services

import (
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type ColorService struct {
}

func (m *ColorService) SelectColors(q *models.Query) ([]*models.Color, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ColorsBadRequest()
	}

	table := query.Color
	s := table.Unscoped()

	// fields
	if q.Fields != "" {
		fieldsArr := strings.Split(q.Fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {
			switch v {
			case "id":
				f = append(f, table.ID)
			case "code":
				f = append(f, table.Code)
			case "name":
				f = append(f, table.Name)
			case "hex":
				f = append(f, table.Hex)
			case "create_at":
				f = append(f, table.CreatedAt)
			case "delete_at":
				f = append(f, table.DeletedAt)
			case "update_at":
				f = append(f, table.UpdatedAt)
			default:
				f = append(f, table.ALL)
			}
		}

		s = s.Select(f...)
	}

	// def query

	s = s.Limit(*q.Limit).Offset(q.Offset)

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
