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

type OrderService struct {
}

func (m *OrderService) SelectOrders(q *models.Query) ([]*models.Order, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Order
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = orderFields(s, q.Fields)

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

func orderFields(s query.IOrderDo, fields string) query.IOrderDo {
	if fields != "" {
		table := query.Order
		fieldsArr := strings.Split(fields, ",")
		var f []field.Expr

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "create_user.") {
				f = append(f, table.CreatedBy)
				s = s.Preload(table.CreateUser)
				continue
			}

			if strings.HasPrefix(v, "cancel_user.") {
				f = append(f, table.CanceledBy)
				s = s.Preload(table.CancelUser)
				continue
			}

			if strings.HasPrefix(v, "custom.") {
				f = append(f, table.CustomID)
				s = s.Preload(table.Custom)
				continue
			}

			if strings.HasPrefix(v, "color_by_reference.") {
				f = append(f, table.ColorByReferenceID)
				s = s.Preload(table.ColorByReference)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "status":
				f = append(f, table.Status)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "finished_at":
				f = append(f, table.FinishedAt)
			case "canceled_at":
				f = append(f, table.CanceledAt)
			case "color_by_reference_id":
				f = append(f, table.ColorByReferenceID)
			case "custom_id":
				f = append(f, table.CustomID)
			case "created_by":
				f = append(f, table.CreatedBy)
			case "canceled_by":
				f = append(f, table.CanceledBy)
			case "cancel_user":
				f = append(f, table.CanceledBy)
				s = s.Preload(table.CancelUser)
			case "create_user":
				f = append(f, table.CreatedBy)
				s = s.Preload(table.CreateUser)
			case "color_by_reference":
				f = append(f, table.ColorByReferenceID)
				s = s.Preload(table.ColorByReference)
			case "custom":
				f = append(f, table.CustomID)
				s = s.Preload(table.Custom)

			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}

func (m *OrderService) CreateOrder(b *models.OrderCreateBody) (*models.Order, error) {
	// check valid custom
	err := checkValidCustom(b.CustomID)

	if err != nil {
		return nil, err
	}

	order := &models.Order{
		Status:             models.Created,
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
