package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ResourceRepository interface {
	SelectResources(*models.Query) ([]*models.Resource, error)
	AggregationResources(*models.AggregateQuery) ([]*models.AggregateData, error)
}
