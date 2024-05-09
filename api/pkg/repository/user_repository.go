package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	SelectUsers(*models.Request) ([]*models.User, error)
	AggregationUsers(*models.AggregateRequest) ([]*models.AggregateData, error)
}
