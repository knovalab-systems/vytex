package models

import (
	"time"

	"gorm.io/gorm"
)

type Supplier struct {
	ID        uint           `json:"id,omitempty" gorm:"primary_key"`
	Name      string         `json:"name,omitempty"`
	Brand     string         `json:"brand,omitempty"`
	Nit       string         `json:"nit,omitempty"`
	Code      string         `json:"code,omitempty"`
	CreatedAt *time.Time     `json:"created_at,omitempty"`
	UpdatedAt *time.Time     `json:"updated_at,omitempty"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

type ReadSupplier struct {
	ID uint `param:"supplierId" validate:"required"`
	Query
}

type SupplierCreateBody struct {
	Name  string `json:"name,omitempty" validate:"required"`
	Brand string `json:"brand,omitempty" validate:"required"`
	Nit   string `json:"nit,omitempty" validate:"required,len=9"`
	Code  string `json:"code,omitempty" validate:"required"`
}

type SupplierUpdateBody struct {
	ID        uint                `param:"supplierId" validate:"required"`
	Name      string              `json:"name,omitempty" validate:"omitempty"`
	Brand     string              `json:"brand,omitempty" validate:"omitempty"`
	Nit       string              `json:"nit,omitempty" validate:"omitempty,len=9"`
	Code      string              `json:"code,omitempty" validate:"omitempty"`
	DeletedAt Optional[time.Time] `json:"deleted_at"`
}

func (m *SupplierUpdateBody) ToUpdate() (map[string]interface{}, error) {
	updateMap := map[string]interface{}{}

	if m.Name != "" {
		updateMap["name"] = m.Name
	}

	if m.Brand != "" {
		updateMap["brand"] = m.Brand
	}

	if m.Nit != "" {
		updateMap["nit"] = m.Nit
	}

	if m.Code != "" {
		updateMap["code"] = m.Code
	}

	if !m.DeletedAt.IsNil() {
		if m.DeletedAt.IsNullDefined() {
			updateMap["deleted_at"] = nil
		} else {
			updateMap["deleted_at"] = m.DeletedAt.Value
		}

	}

	return updateMap, nil
}
