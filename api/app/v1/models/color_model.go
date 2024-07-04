package models

import (
	"time"

	"gorm.io/gorm"
)

type Color struct {
	ID        uint           `json:"id,omitempty" gorm:"primary_key"`
	Name      string         `json:"name,omitempty"`
	Code      string         `json:"code,omitempty"`
	Hex       string         `json:"hex,omitempty"`
	CreatedAt *time.Time     `json:"create_at,omitempty"`
	UpdatedAt *time.Time     `json:"update_at,omitempty"`
	DeletedAt gorm.DeletedAt `json:"delete_at,omitempty" gorm:"index"`
}

type ColorCreateBody struct {
	Name string `json:"name" validate:"required"`
	Code string `json:"code" validate:"required"`
	Hex  string `json:"hex" validate:"required,hexcolor"`
}
