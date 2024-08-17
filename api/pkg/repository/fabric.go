package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type FabricRepository interface {
	SelectFabrics(*models.Query) ([]*models.Fabric, error)
	SelectFabric(*models.FabricRead) (*models.Fabric, error)
	AggregationFabrics(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateFabric(*models.FabricCreateBody) (*models.Fabric, error)
}
