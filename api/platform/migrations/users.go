package migrations

import (
	"errors"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreateFirstAdmin(admin *models.Role, db *gorm.DB) error {
	if db.Migrator().HasTable(&models.User{}) {
		err := db.First(&models.User{}).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(envs.ADMIN_PASSWORD_DEFAULT()), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			now := time.Now()
			err = db.Create(&models.User{
				Username:  "admin",
				Name:      "Administrador",
				Password:  string(hashedPassword),
				CreatedAt: &now,
				UpdatedAt: &now,
				RoleId:    admin.ID,
			}).Error
			return err
		}
		return err
	}
	return errors.New("USER TABLE NO EXISTS")
}
