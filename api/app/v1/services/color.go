package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

type ColorService struct {
}

func (m *ColorService) SelectColors(q *models.Query) ([]*models.Color, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Color
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = colorFields(s, q.Fields)

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

func (m *ColorService) CreateColor(b *models.ColorCreateBody) (*models.Color, error) {
	// check code
	err := checkColorExists(b.Code)
	if err != nil {
		return nil, err
	}

	// def color
	color := &models.Color{
		Name: b.Name,
		Hex:  b.Hex,
		Code: b.Code,
	}

	// run create
	err = query.Color.Create(color)
	if err != nil {
		return nil, err
	}

	return color, nil
}

func (m *ColorService) SelectColor(q *models.ReadColor) (*models.Color, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Color
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = colorFields(s, q.Fields)

	// run query
	color, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return color, nil
}

func (m *ColorService) UpdateColor(b *models.ColorUpdateBody) (*models.Color, error) {
	// check code
	if b.Code != "" {
		err := checkColorExists(b.Code)
		if err != nil {
			return nil, err
		}
	}

	// get update map
	updateMap := formats.ColorUpdateMap(b)
	if len(updateMap) == 0 {
		return nil, problems.UpdateColorBadRequest()
	}

	// run update
	table := query.Color
	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	// check update
	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	// get update color
	color, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return color, nil
}

func checkColorExists(code string) error {
	table := query.Color

	_, err := table.Unscoped().Where(table.Code.Eq(code)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.ColorExists()
}

func colorFields(s query.IColorDo, fields string) query.IColorDo {
	if fields != "" {
		table := query.Color
		fieldsArr := strings.Split(fields, ",")
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
			case "created_at":
				f = append(f, table.CreatedAt)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			case "updated_at":
				f = append(f, table.UpdatedAt)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}
