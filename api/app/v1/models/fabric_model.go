package models

import (
	"time"

	"gorm.io/gorm"
)

type Fabric struct {
	ID      uint   `json:"id" gorm:"primary_key"`
	Name    string `json:"name"`
	Code    string `json:"code"`
	ColorID uint   `json:"colorId"`
	Color   *Color `json:"color,omitempty"`
}

type FabricV struct {
	ID        uint           `json:"id" gorm:"primary_key"`
	Cost      float64        `json:"cost" gorm:"type:float"`
	CreatedAt time.Time      `json:"create_at"`
	DeletedAt gorm.DeletedAt `json:"delete_at" gorm:"index"`
	FabricId  uint           `json:"fabricId"`
	Fabric    *Fabric        `json:"fabric,omitempty"`
}
