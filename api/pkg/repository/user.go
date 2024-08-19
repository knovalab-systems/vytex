package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	SelectUsers(*models.Query) ([]*models.User, error)
	SelectUser(*models.UserRead) (*models.User, error)
	AggregationUsers(*models.AggregateQuery) ([]*models.AggregateData, error)
	UpdateUser(*models.UserUpdateBody) (*models.User, error)
	CreateUser(*models.UserCreateBody) (*models.User, error)
}
