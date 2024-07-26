package models

import (
	"time"
)

type Order struct {
	ID                 uint              `json:"id,omitempty" gorm:"primary_key"`
	Status             StatusOrder       `json:"status,omitempty" gorm:"type:status_order"`
	CreatedAt          *time.Time        `json:"created_at,omitempty"`
	FinishedAt         *time.Time        `json:"finished_at,omitempty"`
	CanceledAt         *time.Time        `json:"canceled_at,omitempty"`
	ColorByReferenceID uint              `json:"color_by_reference_id,omitempty"`
	CustomID           uint              `json:"custom_id,omitempty"`
	CreatedBy          string            `json:"created_by,omitempty"`
	CanceledBy         *string           `json:"canceled_by,omitempty"`
	CancelUser         *User             `json:"cancel_user,omitempty" gorm:"foreignKey:CanceledBy"`
	CreateUser         *User             `json:"create_user,omitempty" gorm:"foreignKey:CreatedBy"`
	ColorByReference   *ColorByReference `json:"color_by_reference,omitempty"`
	Custom             *Custom           `json:"custom,omitempty"`
	SizeInt
}

type StatusOrder string

const (
	Created StatusOrder = "Created"
)
