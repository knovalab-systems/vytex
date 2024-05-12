package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	SelectUsers(*models.Request) ([]*models.User, error)
	SelectUserByName(string) ([]*models.User, error)
	SelectUserByUsername(string) ([]*models.User, error)
	SelectDisableUsers(*models.Request) ([]*models.User, error)
	SelectEnableUsers(*models.Request) ([]*models.User, error)
	AggregationUsers(*models.AggregateRequest) ([]*models.AggregateData, error)
}
