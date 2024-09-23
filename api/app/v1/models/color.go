package models

import (
	"time"

	"gorm.io/gorm"
)

type Color struct {
	ID        uint            `json:"id,omitempty" gorm:"primary_key"`
	Name      string          `json:"name,omitempty"`
	Code      string          `json:"code,omitempty"`
	Hex       string          `json:"hex,omitempty"`
	CreatedAt *time.Time      `json:"created_at,omitempty"`
	UpdatedAt *time.Time      `json:"updated_at,omitempty"`
	DeletedAt *gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

type ColorCreateBody struct {
	Name string `json:"name" validate:"required"`
	Code string `json:"code" validate:"required"`
	Hex  string `json:"hex" validate:"required,hexcolor"`
}

type ReadColor struct {
	ID uint `param:"colorId" validate:"required"`
	Query
}

type ColorUpdateBody struct {
	ID        uint                `param:"colorId" validate:"required,gt=0"`
	Name      string              `json:"name" validate:"omitempty,gt=0"`
	Code      string              `json:"code" validate:"omitempty,gt=0"`
	Hex       string              `json:"hex" validate:"omitempty,hexcolor"`
	DeletedAt Optional[time.Time] `json:"deleted_at"`
}
