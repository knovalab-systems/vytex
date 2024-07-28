package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type OrderRepository interface {
	SelectOrders(*models.Query) ([]*models.Order, error)
	AggregationOrders(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateOrder(*models.OrderCreateBody) (*models.Order, error)
}
