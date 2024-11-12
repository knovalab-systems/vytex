package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
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
	if q.Fields != "" {
		s = fields.ColorFields(s, q.Fields)
	}

	// run query
	colors, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return colors, nil
}

func (m *ColorService) AggregationColors(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	s := query.Color.Unscoped()
	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountColor(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.ColorSwitch(groupByArr, func(s string) bool { return false })
		err := s.Select(append(groupBy, count...)...).Group(groupBy...).Scan(a)
		if err != nil {
			return nil, problems.ServerError()
		}
		aggregate.AdjustSubfix(a, countArr)
		return a, nil
	}

	b := map[string]interface{}{}
	err := s.Select(count...).Scan(&b)
	if err != nil {
		return nil, problems.ServerError()
	}
	*a = append(*a, b)
	aggregate.AdjustSubfix(a, countArr)
	return a, nil
}

func (m *ColorService) CreateColor(b *models.ColorCreateBody) (*models.Color, error) {
	// check code
	err := helpers.CheckColorExists(b.Code)
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
	if q.Fields != "" {
		s = fields.ColorFields(s, q.Fields)
	}

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
		err := helpers.CheckColorExists(b.Code)
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
