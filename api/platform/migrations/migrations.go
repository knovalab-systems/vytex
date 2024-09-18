package migrations

import (
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {

	err := CreateTimeByTasksDefault(db)
	if err != nil {
		return err
	}

	admin, err := CreateBasicRoles(db)
	if err != nil {
		return err
	}

	err = CreateFirstAdmin(admin, db)
	if err != nil {
		return err
	}

	err = CreateOrderStatus(db)
	if err != nil {
		return err
	}
	err = CreateTasksSteps(db)
	if err != nil {
		return err
	}

	return nil
}
