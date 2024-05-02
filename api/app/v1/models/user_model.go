package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string         `json:"id,omitempty" gorm:"type:uuid;primary_key;"`
	UserName  string         `json:"user_name,omitempty"`
	Name      string         `json:"name,omitempty"`
	Password  string         `json:"password,omitempty"`
	Role      int8           `json:"role,omitempty"`
	DeleteAt  gorm.DeletedAt `json:"delete_at,omitempty"`
	CreatedAt time.Time      `json:"create_at,omitempty"`
	UpdatedAt time.Time      `json:"update_at,omitempty"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	return
}
