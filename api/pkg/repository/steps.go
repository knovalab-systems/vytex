package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type StepRepository interface {
	SelectSteps(*models.Query) ([]*models.Step, error)
}
