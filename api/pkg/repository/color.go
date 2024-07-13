package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ColorRepository interface {
	SelectColors(*models.Query) ([]*models.Color, error)
	AggregationColors(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateColor(*models.ColorCreateBody) (*models.Color, error)
}
