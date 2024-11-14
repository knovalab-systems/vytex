package services

import (
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"gorm.io/gen/field"
	"reflect"
	"strings"

	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type CustomService struct {
}

func (m *CustomService) SelectCustoms(q *models.Query) ([]*models.Custom, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Custom
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.CustomFields(s, q.Fields)
	}

	// run query
	customs, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return customs, nil
}

func (m *CustomService) AggregationCustoms(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	s := query.Custom.Unscoped()
	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountCustoms(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.CustomSwitch(groupByArr, func(s string) bool { return false })

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

func (m *CustomService) CreateCustom(b *models.CustomCreateBody) (*models.Custom, error) {

	status, err := helpers.GetOrderStateByValue(models.CreatedOrderStateValue)
	if err != nil {
		return nil, err
	}

	orders := []models.Order{}
	for _, v := range b.Orders {

		reflectSize := reflect.ValueOf(v.SizeInt)
		total := 0

		for i := 0; i < reflectSize.NumField(); i++ {
			total = total + int(reflectSize.Field(i).Int())
		}

		// must be gt 0
		if total == 0 {
			return nil, problems.CreateCustomBadRequest()
		}

		orders = append(orders, models.Order{OrderStateID: status.ID, SizeInt: v.SizeInt, CreatedBy: b.CreatedBy, ColorByReferenceID: v.ColorByReferenceID})
	}

	custom := &models.Custom{CreatedBy: b.CreatedBy, Client: b.Client, Orders: orders}

	err = query.Custom.Create(custom)
	if err != nil {
		return nil, problems.ServerError()
	}

	return custom, nil
}

func (m *CustomService) SelectCustom(q *models.ReadCustom) (*models.Custom, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Custom
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.CustomFields(s, q.Fields)
	}

	// run query
	custom, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return custom, nil
}
