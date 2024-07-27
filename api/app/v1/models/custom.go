package models

import "time"

type Custom struct {
	ID         uint       `json:"id,omitempty" gorm:"primary_key"`
	Client     string     `json:"client,omitempty"`
	CreatedAt  *time.Time `json:"created_at,omitempty"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
	CanceledAt *time.Time `json:"canceled_at,omitempty"`
	CreatedBy  string     `json:"created_by,omitempty"`
	CanceledBy *string    `json:"canceled_by,omitempty"`
	CancelUser *User      `json:"cancel_user,omitempty" gorm:"foreignKey:CanceledBy"`
	CreateUser *User      `json:"create_user,omitempty" gorm:"foreignKey:CreatedBy"`
	Orders     []Order    `json:"orders,omitempty"`
}

type CustomCreateBody struct {
	Client    string                  `json:"client,omitempty" validate:"required"`
	CreatedBy string                  `json:"created_by" validate:"required,uuid"`
	Orders    []CustomOrderCreateBody `json:"orders" validate:"required,min=1,dive"`
}

type CustomOrderCreateBody struct {
	ColorByReferenceID uint `json:"color_by_reference_id" validate:"required,gt=0"`
	SizeInt
}

type ReadCustom struct {
	ID uint `param:"customId" validate:"required"`
	Query
}
