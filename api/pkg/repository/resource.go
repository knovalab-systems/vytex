package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ResourceRepository interface {
	SelectResources(*models.Query) ([]*models.Resource, error)
	SelectResource(*models.ResourceRead) (*models.Resource, error)
	AggregationResources(*models.AggregateQuery) (*[]map[string]interface{}, error)
	CreateResource(*models.ResourceCreateBody) (*models.Resource, error)
	UpdateResource(*models.ResourceUpdateBody) (*models.Resource, error)
}
