package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type RoleRepository interface {
	SelectRoles(*models.Query) ([]*models.Role, error)
	SelectRole(*models.RoleRead) (*models.Role, error)
	AggregationRoles(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateRole(*models.RoleCreateBody) (*models.Role, error)
	UpdateRole(*models.RoleUpdateBody) (*models.Role, error)
}
