package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type CustomRepository interface {
	SelectCustoms(*models.Query) ([]*models.Custom, error)
	SelectCustom(*models.ReadCustom) (*models.Custom, error)
	AggregationCustoms(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateCustom(*models.CustomCreateBody) (*models.Custom, error)
}
