package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string `gorm:"type:uuid;primary_key;"`
	UserName  string `gorm:"unique;"`
	Name      string
	Password  string
	Role      int8
	DeleteAt  gorm.DeletedAt
	CreatedAt time.Time
	UpdatedAt time.Time
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	return
}
