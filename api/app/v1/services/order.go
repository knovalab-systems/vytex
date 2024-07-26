package services

import (
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

type OrderService struct {
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

	if custom.FinishedAt != nil && custom.CanceledAt != nil {
		return problems.OrderFinishedCanceled()
	} else if custom.FinishedAt != nil {
		return problems.OrderFinished()
	} else if custom.CanceledAt != nil {
		return problems.OrderCanceled()
	}

	return nil
}
