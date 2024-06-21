package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Resource struct {
	ID        uint           `json:"id" gorm:"primary_key"`
	Key       string         `json:"key" gorm:"type:uuid"`
	Name      string         `json:"name"`
	Cost      float64        `json:"cost" gorm:"type:float"`
	Code      string         `json:"code"`
	ColorID   uint           `json:"colorId"`
	Color     *Color         `json:"color,omitempty"`
	CreatedAt time.Time      `json:"create_at"`
	DeletedAt gorm.DeletedAt `json:"delete_at" gorm:"index"`
}

// BeforeCreate will set a UUID to key, if is not set
func (b *Resource) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Key) == 0 {
		b.Key = uuid.New().String()

	}
	return nil
}
