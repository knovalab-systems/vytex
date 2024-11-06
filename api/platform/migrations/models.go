package migrations

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func Models(db *gorm.DB) error {

	err := db.AutoMigrate(&models.User{}, &models.Session{},
		&models.Color{}, &models.Resource{}, &models.Fabric{},
		&models.Reference{}, &models.ColorByReference{}, &models.Piece{},
		&models.ResourceByReference{}, &models.FabricByReference{},
		&models.Image{}, &models.Supplier{}, &models.Composition{},
		&models.Custom{}, &models.Order{}, &models.TimeByTask{}, &models.Role{},
		&models.OrderState{}, &models.Step{}, &models.Task{}, &models.TaskControl{},
		&models.TaskControlState{})

	return err

}
