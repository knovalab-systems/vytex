package services

import (
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"gorm.io/gen/field"
	"strings"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

type OrderService struct {
}

func (m *OrderService) SelectOrders(q *models.Query) ([]*models.Order, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Order
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.OrderFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.OrderFilters(s, q.Filter)
		if err != nil {
			return nil, problems.OrdersBadRequest()
		}
	}

	// run query
	orders, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return orders, nil
}

func (m *OrderService) SelectOrder(q *models.OrderRead) (*models.Order, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Order
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.OrderFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.OrderFilters(s, q.Filter)
		if err != nil {
			return nil, problems.OrdersBadRequest()
		}
	}

	order, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return order, nil
}

func (m *OrderService) AggregationOrders(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	s := query.Order.Unscoped()
	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountOrder(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.OrderSwitch(groupByArr, func(s string) bool { return false })
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

func (m *OrderService) CreateOrder(b *models.OrderCreateBody) (*models.Order, error) {
	// check valid custom
	err := helpers.CheckValidCustom(b.CustomID)

	if err != nil {
		return nil, err
	}

	status, err := helpers.GetOrderStateByValue(models.CreatedOrderStateValue)
	if err != nil {
		return nil, err
	}

	order := &models.Order{
		OrderStateID:       status.ID,
		SizeInt:            b.SizeInt,
		CreatedBy:          b.CreatedBy,
		ColorByReferenceID: b.ColorByReferenceID,
		CustomID:           b.CustomID,
	}

	// create
	err = query.Order.Create(order)
	if err != nil {
		return nil, err
	}

	return order, nil
}

func (m *OrderService) UpdateOrder(b *models.OrderUpdateBody) (*models.Order, error) {

	table := query.Order

	order, err := table.Preload(table.OrderState).Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	if b.OrderStateID != 0 {

		if order.OrderState.Value == models.CreatedOrderStateValue {
			stateStarted, err := helpers.GetOrderStateByValue(models.StartedOrderStateValue)
			if err != nil {
				return nil, problems.ServerError()
			}

			if b.OrderStateID == stateStarted.ID {
				now := time.Now()
				order.StartedAt = &now
				order.OrderStateID = b.OrderStateID
				order.OrderState = nil
			} else {
				return nil, problems.ReadAccess()
			}

			rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(order)
			if err != nil {
				return nil, problems.ServerError()
			}

			if rows.RowsAffected == 0 {
				return nil, problems.ReadAccess()
			}

			task, err := helpers.GetTaskByValue(models.Trazar)
			if err != nil {
				return nil, problems.ServerError()
			}
			taskState, err := helpers.GetTaskControlStateByValue(models.CreatedTaskControlStateValue)
			if err != nil {
				return nil, problems.ServerError()
			}
			err = query.TaskControl.Create(&models.TaskControl{TaskID: task.ID, OrderID: order.ID, TaskControlStateID: taskState.ID})
			if err != nil {
				return nil, problems.ServerError()
			}

			return order, nil
		}

	}

	return nil, problems.ReadAccess()
}
