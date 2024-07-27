package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type OrderRepository interface {
	CreateOrder(*models.OrderCreateBody) (*models.Order, error)
}
