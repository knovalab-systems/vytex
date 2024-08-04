package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ResourceRepository interface {
	SelectResources(*models.Query) ([]*models.Resource, error)
	SelectResource(*models.ReadResource) (*models.Resource, error)
	AggregationResources(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateResource(*models.ResourceCreateBody) (*models.Resource, error)
	UpdateResource(body *models.ResourceUpdateBody) (*models.Resource, error)
}
