package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type RoleRepository interface {
	SelectRoles(*models.Query) ([]*models.Role, error)
	AggregationRoles(*models.AggregateQuery) ([]*models.AggregateData, error)
}
