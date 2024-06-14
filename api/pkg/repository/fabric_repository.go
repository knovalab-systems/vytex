package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type FabricRepository interface {
	SelectFabrics(*models.Query) ([]*models.FabricV, error)
}
