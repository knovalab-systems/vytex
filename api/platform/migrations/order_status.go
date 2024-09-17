package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateOrderStatus(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.OrderState{}) {

		defaultOrderStatus := models.DefaultOrderStatus()

		for _, v := range defaultOrderStatus {
			err := db.Where(models.OrderState{Value: v.Value}).Assign(v).FirstOrCreate(&models.OrderState{}).Error
			if err != nil {
				return err
			}
		}

		return nil
	}

	return errors.New("ORDER_STATUS TABLE NO EXISTS")
}
