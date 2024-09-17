package models

import (
	"time"
)

type Order struct {
	ID                 uint              `json:"id,omitempty" gorm:"primary_key"`
	CreatedAt          *time.Time        `json:"created_at,omitempty"`
	FinishedAt         *time.Time        `json:"finished_at,omitempty"`
	CanceledAt         *time.Time        `json:"canceled_at,omitempty"`
	StartedAt          *time.Time        `json:"started_at,omitempty"`
	OrderStateID       uint              `json:"order_state_id,omitempty"`
	OrderState         *OrderState       `json:"order_state,omitempty"`
	ColorByReferenceID uint              `json:"color_by_reference_id,omitempty"`
	ColorByReference   *ColorByReference `json:"color_by_reference,omitempty"`
	CustomID           uint              `json:"custom_id,omitempty"`
	Custom             *Custom           `json:"custom,omitempty"`
	CreatedBy          string            `json:"created_by,omitempty"`
	CreateUser         *User             `json:"create_user,omitempty" gorm:"foreignKey:CreatedBy"`
	CanceledBy         *string           `json:"canceled_by,omitempty"`
	CancelUser         *User             `json:"cancel_user,omitempty" gorm:"foreignKey:CanceledBy"`
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

type OrderRead struct {
	ID uint `param:"orderId" validate:"required"`
	Query
}

type OrderUpdateBody struct {
	ID           uint `param:"orderId" validate:"required"`
	OrderStateID uint `json:"order_state_id,omitempty"`
}
