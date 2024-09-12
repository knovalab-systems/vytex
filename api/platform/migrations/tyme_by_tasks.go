package migrations

import (
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateTimeByTasksDefault(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.TimeByTask{}) {
		err := db.FirstOrCreate(&models.TimeByTask{}, formats.TimeByTaskDTOFormat(models.TimeByTaskDTO{})).Error
		if err != nil {
			return err
		}
	}
	return nil
}
