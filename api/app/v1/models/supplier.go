package models

import (
	"time"

	"gorm.io/gorm"
)

type Supplier struct {
	ID        uint           `json:"id,omitempty" gorm:"primary_key"`
	Name      string         `json:"name,omitempty"`
	Nit       string         `json:"nit,omitempty"`
	Code      string         `json:"code,omitempty"`
	CreatedAt *time.Time     `json:"created_at,omitempty"`
	UpdatedAt *time.Time     `json:"updated_at,omitempty"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

type SupplierCreateBody struct {
	Name string `json:"name,omitempty" validate:"required"`
	Nit  string `json:"nit,omitempty" validate:"required,len=9"`
	Code string `json:"code,omitempty" validate:"required"`
}
