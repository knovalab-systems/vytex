package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Image struct {
	ID       string `json:"id" gorm:"type:uuid;primary_key;"`
	Location string `json:"location,omitempty" gorm:"not null"`
}

// BeforeCreate will set a UUID
func (b *Image) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	return nil
}
