package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateBasicRoles(db *gorm.DB) (*models.Role, error) {
	if db.Migrator().HasTable(&models.Role{}) {
		roles := []*models.Role{}

		defaultRoles := models.DefaultRoles()
		for _, v := range defaultRoles {
			role := &models.Role{}
			err := db.Where(models.Role{Code: v.Code}).Assign(v).FirstOrCreate(role).Error
			if err != nil {
				return nil, err
			}
			roles = append(roles, role)
		}

		return roles[0], nil
	}

	return nil, errors.New("ROLE TABLE NO EXISTS")
}
