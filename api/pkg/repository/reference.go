package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type ReferenceRepository interface {
	CreateReference(*models.ReferenceCreateBody) (*models.Reference, error)
}
