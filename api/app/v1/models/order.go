package models

import (
	"time"
)

type Order struct {
	ID                 uint              `json:"id,omitempty" gorm:"primary_key"`
	OrderStatusID      uint              `json:"status_id,omitempty"`
	CreatedAt          *time.Time        `json:"created_at,omitempty"`
	FinishedAt         *time.Time        `json:"finished_at,omitempty"`
	CanceledAt         *time.Time        `json:"started_at,omitempty"`
	StartedAt          *time.Time        `json:"canceled_at,omitempty"`
	ColorByReferenceID uint              `json:"color_by_reference_id,omitempty"`
	CustomID           uint              `json:"custom_id,omitempty"`
	CreatedBy          string            `json:"created_by,omitempty"`
	CanceledBy         *string           `json:"canceled_by,omitempty"`
	CancelUser         *User             `json:"cancel_user,omitempty" gorm:"foreignKey:CanceledBy"`
	CreateUser         *User             `json:"create_user,omitempty" gorm:"foreignKey:CreatedBy"`
	ColorByReference   *ColorByReference `json:"color_by_reference,omitempty"`
	Custom             *Custom           `json:"custom,omitempty"`
	OrderStatus        *OrderState       `json:"status,omitempty"`
	SizeInt
}

type StatusOrder string

const (
	Created StatusOrder = "Created"
)

type OrderCreateBody struct {
	CustomID           uint   `json:"custom_id,omitempty" validate:"required"`
	CreatedBy          string `json:"created_by,omitempty" validate:"required,uuid"`
	ColorByReferenceID uint   `json:"color_by_reference_id" validate:"required,gt=0"`
	SizeInt
}
