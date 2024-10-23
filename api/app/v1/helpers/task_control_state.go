package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetTaskControlStateByValue(value models.TaskControlStateValue) (*models.TaskControlState, error) {
	table := query.TaskControlState
	return table.Where(table.Value.Eq(string(value))).First()
}
