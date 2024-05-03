package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string         `json:"id" gorm:"type:uuid;primary_key;"`
	UserName  string         `json:"user_name"`
	Name      string         `json:"name"`
	Password  string         `json:"password"`
	Role      int8           `json:"role"`
	DeleteAt  gorm.DeletedAt `json:"delete_at"`
	CreatedAt time.Time      `json:"create_at"`
	UpdatedAt time.Time      `json:"update_at"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	return
}
