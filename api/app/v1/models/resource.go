package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Resource struct {
	ID         uint            `json:"id,omitempty" gorm:"primary_key"`
	Name       string          `json:"name,omitempty"`
	Cost       float64         `json:"cost,omitempty" gorm:"type:float"`
	Code       string          `json:"code,omitempty"`
	Track      string          `json:"track,omitempty" gorm:"type:uuid"`
	ColorID    uint            `json:"color_id,omitempty"`
	Color      *Color          `json:"color,omitempty"`
	SupplierID uint            `json:"supplier_id,omitempty"`
	Supplier   *Supplier       `json:"supplier,omitempty"`
	CreatedAt  *time.Time      `json:"created_at,omitempty"`
	DeletedAt  *gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// BeforeCreate will set a UUID
func (b *Resource) BeforeCreate(tx *gorm.DB) (err error) {
	if b.Track == "" {
		b.Track = uuid.New().String()
	}
	return nil
}

type ResourceRead struct {
	ID uint `param:"resourceId" validate:"required"`
	Query
}

type ResourceCreateBody struct {
	Name     string  `json:"name" validate:"required"`
	Cost     float64 `json:"cost" validate:"required,gt=0"`
	Code     string  `json:"code" validate:"required"`
	Color    uint    `json:"color_id" validate:"required,gt=0"`
	Supplier uint    `json:"supplier_id" validate:"required,gt=0"`
}

type ResourceUpdateBody struct {
	ID        uint                `param:"resourceId" validate:"required"`
	Name      string              `json:"name,omitempty" validate:"omitempty"`
	Cost      float64             `json:"cost,omitempty" validate:"omitempty,gt=0"`
	Code      string              `json:"code,omitempty" validate:"omitempty"`
	Color     uint                `json:"color_id,omitempty" validate:"omitempty,gt=0"`
	Supplier  uint                `json:"supplier_id,omitempty" validate:"omitempty,gt=0"`
	DeletedAt Optional[time.Time] `json:"deleted_at"`
}
