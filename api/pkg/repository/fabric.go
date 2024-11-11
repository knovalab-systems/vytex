package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type FabricRepository interface {
	SelectFabrics(*models.Query) ([]*models.Fabric, error)
	SelectFabric(*models.FabricRead) (*models.Fabric, error)
	AggregationFabrics(*models.AggregateQuery) (*[]map[string]interface{}, error)
	CreateFabric(*models.FabricCreateBody) (*models.Fabric, error)
	UpdateFabric(*models.FabricUpdateBody) (*models.Fabric, error)
}
