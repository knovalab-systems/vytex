package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Fabric struct {
	ID            uint            `json:"id,omitempty" gorm:"primary_key"`
	Name          string          `json:"name,omitempty"`
	Cost          float64         `json:"cost,omitempty" gorm:"type:float"`
	Code          string          `json:"code,omitempty"`
	Track         string          `json:"track,omitempty" gorm:"type:uuid"`
	ColorID       uint            `json:"color_id,omitempty"`
	Color         *Color          `json:"color,omitempty"`
	SupplierID    uint            `json:"supplier_id,omitempty"`
	Supplier      *Supplier       `json:"supplier,omitempty"`
	CompositionID uint            `json:"composition_id,omitempty"`
	Composition   *Composition    `json:"composition,omitempty"`
	CreatedAt     *time.Time      `json:"created_at,omitempty"`
	DeletedAt     *gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// BeforeCreate will set a UUID
func (b *Fabric) BeforeCreate(tx *gorm.DB) (err error) {
	if b.Track == "" {
		b.Track = uuid.New().String()
	}
	return nil
}

type FabricRead struct {
	ID uint `param:"fabricId" validate:"required"`
	Query
}

type FabricCreateBody struct {
	Name        string      `json:"name" validate:"required"`
	Cost        float64     `json:"cost" validate:"required,gt=0"`
	Code        string      `json:"code" validate:"required"`
	Color       uint        `json:"color_id" validate:"required,gt=0"`
	Supplier    uint        `json:"supplier_id" validate:"required,gt=0"`
	Composition Composition `json:"composition" validate:"required"`
}

type FabricUpdateBody struct {
	ID          uint                `param:"fabricId" validate:"required"`
	Name        string              `json:"name,omitempty" `
	Cost        float64             `json:"cost,omitempty" validate:"omitempty,gt=0"`
	Code        string              `json:"code,omitempty"`
	Color       uint                `json:"color_id,omitempty" validate:"omitempty,gt=0"`
	Supplier    uint                `json:"supplier_id,omitempty" validate:"omitempty,gt=0"`
	Composition *Composition        `json:"composition" `
	DeletedAt   Optional[time.Time] `json:"deleted_at"`
}
