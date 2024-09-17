package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetTaskByValue(value models.TaskValue) (*models.Task, error) {
	table := query.Task
	return table.Where(table.Value.Eq(string(value))).First()
}
