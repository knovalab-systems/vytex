package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type TaskControlRepository interface {
	SelectTaskControls(*models.Query) ([]*models.TaskControl, error)
}
