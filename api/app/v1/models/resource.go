package models

import (
	"time"

	"gorm.io/gorm"
)

type Resource struct {
	ID         uint           `json:"id,omitempty" gorm:"primary_key"`
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

func (m *ResourceUpdateBody) ToUpdate() map[string]interface{} {
	updateMap := map[string]interface{}{}

	if m.Name != "" {
		updateMap["name"] = m.Name
	}

	if m.Cost != 0 {
		updateMap["cost"] = m.Cost
	}

	if m.Code != "" {
		updateMap["code"] = m.Code
	}

	if m.Color != 0 {
		updateMap["color_id"] = m.Color
	}

	if m.Supplier != 0 {
		updateMap["supplier_id"] = m.Supplier
	}

	if !m.DeletedAt.IsNil() {
		if m.DeletedAt.IsNullDefined() {
			updateMap["deleted_at"] = nil
		} else {
			updateMap["deleted_at"] = m.DeletedAt.Value
		}
	}

	return updateMap
}
