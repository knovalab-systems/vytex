package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type OrderStateRepository interface {
	SelectOrderStatus(*models.Query) ([]*models.OrderState, error)
}
