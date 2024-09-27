package repository

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/lib/pq"
)

type TaskControlRepository interface {
	SelectTaskControls(*models.Query) ([]*models.TaskControl, error)
	AggregationTaskControls(data *models.AggregateQuery) ([]*models.AggregateData, error)
	UpdateTaskControl(*models.TaskControlUpdateBody, pq.StringArray) (*models.TaskControl, error)
}
