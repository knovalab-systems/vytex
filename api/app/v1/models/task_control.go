package models

import "time"

type TaskControl struct {
	ID         uint         `json:"id,omitempty" gorm:"primary_key"`
	CreatedAt  *time.Time   `json:"created_at,omitempty"`
	StartedAt  *time.Time   `json:"started_at,omitempty"`
	FinishedAt *time.Time   `json:"finished_at,omitempty"`
	RejectedAt *time.Time   `json:"rejected_at,omitempty"`
	TaskID     uint         `json:"task_id,omitempty"`
	Task       *Task        `json:"task,omitempty"`
	OrderID    uint         `json:"order_id,omitempty"`
	Order      *Order       `json:"order,omitempty"`
	NextID     uint         `json:"next_id,omitempty"`
	Next       *TaskControl `json:"next,omitempty" gorm:"foreignKey:NextID"`
	PreviousID uint         `json:"previous_id,omitempty"`
	Previous   *TaskControl `json:"previous,omitempty" gorm:"foreignKey:PreviousID"`
}
