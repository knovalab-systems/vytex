package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"gorm.io/gorm"
)

type User struct {
	ID        string         `json:"id" gorm:"type:uuid;primary_key;"`
	Username  string         `json:"username"`
	Name      string         `json:"name"`
	Password  string         `json:"password"`
	Role      string         `json:"role" gorm:"type:uuid"`
	DeleteAt  gorm.DeletedAt `json:"delete_at"`
	CreatedAt time.Time      `json:"create_at"`
	UpdatedAt time.Time      `json:"update_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	if len(b.Role) == 0 {
		b.Role = utils.NoRole()

	}
	return
}

type UpdateUserBody struct {
	ID   string  `param:"userId" validate:"required,uuid"`
	Role *string `json:"role" validate:"omitnil,uuid"`
}

func (m *UpdateUserBody) ToUpdate() (map[string]interface{}, error) {
	updateMap := map[string]interface{}{}

	if m.Role != nil {
		if IsRole(*m.Role) {
			updateMap["role"] = *m.Role
		} else {
			return nil, errors.New("INVALID ROLE")
		}
	}

	return updateMap, nil
}
