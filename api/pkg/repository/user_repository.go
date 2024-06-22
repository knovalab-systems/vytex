package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	ReadUsers(*models.Query) ([]*models.User, error)
	ReadUser(*models.ReadUser) (*models.User, error)
	AggregationUsers(*models.AggregateQuery) ([]*models.AggregateData, error)
	UpdateUser(*models.UpdateUserBody) (*models.User, error)
	CreateUser(body *models.UserCreateBody) (*models.User, error)
}
