package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Resource struct {
	ID         uint           `json:"id,omitempty" gorm:"primary_key"`
	Key        string         `json:"key,omitempty" gorm:"type:uuid"`
	Name       string         `json:"name,omitempty"`
	Cost       float64        `json:"cost,omitempty" gorm:"type:float"`
	Code       string         `json:"code,omitempty"`
	ColorID    uint           `json:"color_id,omitempty"`
	Color      *Color         `json:"color,omitempty"`
	SupplierID uint           `json:"supplier_id,omitempty"`
	Supplier   *Supplier      `json:"supplier,omitempty"`
	CreatedAt  time.Time      `json:"created_at,omitempty"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// BeforeCreate will set a UUID to key, if is not set
func (b *Resource) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Key) == 0 {
		b.Key = uuid.New().String()

	}
	return nil
}

type ResourceCreateBody struct {
	Name     string  `json:"name" validate:"required"`
	Cost     float64 `json:"cost" validate:"required,gt=0"`
	Code     string  `json:"code" validate:"required"`
	Color    uint    `json:"color_id" validate:"required,gt=0"`
	Supplier uint    `json:"supplier_id" validate:"required,gt=0"`
}
