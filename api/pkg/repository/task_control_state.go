package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type TaskControlStateRepository interface {
	SelectTaskControlStatus(*models.Query) ([]*models.TaskControlState, error)
}
