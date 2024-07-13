package models

import (
	"time"

	"gorm.io/gorm"
)

type Supplier struct {
	ID        uint           `json:"id,omitempty" gorm:"primary_key"`
	Name      string         `json:"name,omitempty"`
	Nit       string         `json:"nit,omitempty"`
	CreatedAt *time.Time     `json:"created_at,omitempty"`
	UpdatedAt *time.Time     `json:"updated_at,omitempty"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}
