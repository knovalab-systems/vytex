package models

import (
	"time"

	"gorm.io/gorm"
)

type Resource struct {
	ID      uint   `json:"id" gorm:"primary_key"`
	Name    string `json:"name"`
	Code    string `json:"code"`
	ColorID uint   `json:"colorId"`
	Color   *Color `json:"color,omitempty"`
}

type ResourceV struct {
	ID         uint           `json:"id" gorm:"primary_key"`
	Cost       float64        `json:"cost" gorm:"type:float"`
	CreatedAt  time.Time      `json:"create_at"`
	DeletedAt  gorm.DeletedAt `json:"delete_at" gorm:"index"`
	ResourceId uint
	Resource   *Resource
}
