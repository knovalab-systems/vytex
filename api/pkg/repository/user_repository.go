package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	SelectUsers(*models.Request) ([]*models.User, error)
	SelectUserByName(*models.Request, string) ([]*models.User, error)
	SelectUserByUsername(*models.Request, string) ([]*models.User, error)
	SelectDisabledUsers(*models.Request) ([]*models.User, error)
	SelectEnabledUsers(*models.Request) ([]*models.User, error)
	SelectUsersByRole(*models.Request, int8) ([]*models.User, error)
	AggregationUsers(*models.AggregateRequest) ([]*models.AggregateData, error)
}
