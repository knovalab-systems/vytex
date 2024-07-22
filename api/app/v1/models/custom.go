package models

import "time"

type Custom struct {
	ID         uint       `json:"id,omitempty" gorm:"primary_key"`
	Client     string     `json:"client,omitempty"`
	CreatedAt  *time.Time `json:"created_at,omitempty"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
	CanceledAt *time.Time `json:"canceled_at,omitempty"`
	CreatedBy  string     `json:"created_by,omitempty"`
	CreateUser *User      `json:"create_user,omitempty" gorm:"foreignKey:CreatedBy"`
	CanceledBy string     `json:"canceled_by,omitempty"`
	CancelUser *User      `json:"cancel_user,omitempty" gorm:"foreignKey:CanceledBy"`
}
