package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateTasksSteps(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.Step{}) && db.Migrator().HasTable(&models.Task{}) {

		stepMap := make(map[models.StepValue]uint)

		defaultSteps := models.DefaultSteps()
		for _, v := range defaultSteps {
			step := &models.Step{}
			err := db.Where(models.Step{Value: v.Value}).Assign(v).FirstOrCreate(step).Error
			if err != nil {
				return err
			}
			stepMap[v.Value] = step.ID
		}

		defaultTasks := models.DefaultTasks(stepMap)
		for _, v := range defaultTasks {
			err := db.Where(models.Task{Value: v.Value}).Assign(v).FirstOrCreate(&models.Task{}).Error
			if err != nil {
				return err
			}
		}

		return nil
	}
	return errors.New("TASK TABLE OR STEP TABLE NO EXISTS")
}
