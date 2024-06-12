package models

import (
	"time"

	"gorm.io/gorm"
)

type Color struct {
	ID        uint           `json:"id" gorm:"primary_key"`
	Name      string         `json:"name"`
	Code      string         `json:"code"`
	Hex       string         `json:"hex"`
	CreatedAt time.Time      `json:"create_at"`
	UpdatedAt time.Time      `json:"update_at"`
	DeletedAt gorm.DeletedAt `json:"delete_at" gorm:"index"`
}
