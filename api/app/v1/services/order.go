package services

import (
	"errors"
	"strings"

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
	s = fields.Fields(s, q.Fields).(query.IOrderDo)

	// filters
	s, err := filters.OrderFilters(s, q.Filter)
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	// run query
	orders, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return orders, nil
}

func (m *OrderService) AggregationOrders(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Order
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
					aggregateElem.Count = &count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil
}

func (m *OrderService) CreateOrder(b *models.OrderCreateBody) (*models.Order, error) {
	// check valid custom
	err := checkValidCustom(b.CustomID)

	if err != nil {
		return nil, err
	}

	status, err := helpers.GetOrderStatusByValue(models.CreatedOrderStateValue)
	if err != nil {
		return nil, err
	}

	order := &models.Order{
		OrderStatusID:      status.ID,
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

func checkValidCustom(customID uint) error {
	table := query.Custom

	// def query
	custom, err := table.Unscoped().Where(table.ID.Eq(customID)).First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}

	if custom.FinishedAt != nil {
		return problems.CustomFinished()
	} else if custom.CanceledAt != nil {
		return problems.CustomCanceled()
	}

	return nil
}
