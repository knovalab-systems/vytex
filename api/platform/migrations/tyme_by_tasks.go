package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateTimeByTasksDefault(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.TimeByTask{}) {
		err := db.FirstOrCreate(&models.TimeByTask{}, formats.TimeByTaskDTOFormat(models.TimeByTaskDTO{})).Error
		return err
	}
	return errors.New("TIME BY TASK TABLE NO EXISTS")
}
