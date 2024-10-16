package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateTaskControlStatus(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.TaskControlState{}) {

		defaultTaskControlStatus := models.DefaultTaskControlStatus()

		for _, v := range defaultTaskControlStatus {
			err := db.Where(models.TaskControlState{Value: v.Value}).Assign(v).FirstOrCreate(&models.TaskControlState{}).Error
			if err != nil {
				return err
			}
		}

		return nil
	}

	return errors.New("TASK CONTROL STATUS TABLE NO EXISTS")
}
