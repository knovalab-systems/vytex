package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ReferenceRepository interface {
	SelectReferences(*models.Query) ([]*models.Reference, error)
	AggregationReferences(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateReference(*models.ReferenceCreateBody) (*models.Reference, error)
	UpdateTimesReference(*models.TimeByTaskReferenceUpdate) (*models.Reference, error)
	SelectReference(*models.ReferenceRead) (*models.Reference, error)
	SelectReferenceImages(*models.ReferenceRead) ([]byte, error)
}
