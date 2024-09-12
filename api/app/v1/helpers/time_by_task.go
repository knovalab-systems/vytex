package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func GetDefaultTimeByTask() (*models.TimeByTask, error) {
	table := query.TimeByTask
	timeByTask, err := table.Where(field.Attrs(formats.TimeByTaskDTOFormat(models.TimeByTaskDTO{}))).FirstOrCreate()
	if err != nil {
		return nil, problems.ServerError()
	}
	return timeByTask, nil
}
