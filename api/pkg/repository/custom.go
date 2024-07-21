package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type CustomRepository interface {
	SelectCustoms(*models.Query) ([]*models.Custom, error)
	//AggregationCustoms(*models.AggregateQuery) ([]*models.AggregateData, error)
}
