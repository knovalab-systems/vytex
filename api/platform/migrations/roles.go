package migrations

import (
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

func CreateBasicRoles(db *gorm.DB) (*models.Role, error) {
	if db.Migrator().HasTable(&models.Role{}) {
		roles := []struct {
			Role   *models.Role
			Assign *models.Role
			Code   string
		}{
			{Role: &models.Role{}, Assign: models.ADMIN_ROLE(), Code: models.ADMIN_ROLE_CODE},
			{Role: &models.Role{}, Assign: models.DESIGNER_ROLE(), Code: models.DESIGNER_ROLE_CODE},
			{Role: &models.Role{}, Assign: models.PRO_SUPERVISOR_ROLE(), Code: models.PRO_SUPERVISOR_ROLE_CODE},
		}

		for _, v := range roles {
			err := db.Where(models.Role{Code: v.Code}).Assign(v.Assign).FirstOrCreate(v.Role).Error
			if err != nil {
				return nil, err
			}
		}

		return roles[0].Role, nil
	}

	return nil, errors.New("ROLE TABLE NO EXISTS")
}
