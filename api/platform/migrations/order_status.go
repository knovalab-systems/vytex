package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateOrderStatus(db *gorm.DB) error {
	if db.Migrator().HasTable(&models.OrderStatus{}) {

		statusOrder := []struct {
			Status *models.OrderStatus
		}{
			{Status: models.CreatedOrderStatus()},
			{Status: models.StartedOrderStatus()},
		}

		for _, v := range statusOrder {
			err := db.FirstOrCreate(&models.OrderStatus{}, v.Status).Error
			if err != nil {
				return err
			}
		}

		return nil
	}

	return errors.New("ORDER_STATUS TABLE NO EXISTS")
}
