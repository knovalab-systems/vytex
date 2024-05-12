package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type UserRepository interface {
	SelectUsers(*models.Query) ([]*models.User, error)
	GetUserFilter(u *models.Query) (models.UserFilter, error)
	SelectUsersByFilter(filter *models.UserFilter, req *models.Query) ([]*models.User, error)
	AggregationUsers(*models.AggregateQuery) ([]*models.AggregateData, error)
	UpdateUser(*models.UpdateUserBody) (*models.User, error)
}
