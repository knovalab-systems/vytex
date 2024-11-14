package services

import (
	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"strings"
)

type OrderStateService struct {
}

func (m *OrderStateService) SelectOrderStatus(q *models.Query) ([]*models.OrderState, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.OrderState
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.OrderStateFields(s, q.Fields)
	}

	// run query
	orderStatus, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return orderStatus, nil

}

func (m *OrderStateService) AggregationOrderState(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	s := query.OrderState.Unscoped()
	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprCountOrderState(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.OrderStateSwitch(groupByArr, func(s string) bool { return false })
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
