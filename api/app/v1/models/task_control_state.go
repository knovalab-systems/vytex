package models

type TaskControlState struct {
	ID    uint                  `json:"id,omitempty" gorm:"primary_key"`
	Name  string                `json:"name"`
	Value TaskControlStateValue `json:"value" gorm:"type:text"`
}

type TaskControlStateValue string

const (
	CreatedTaskControlStateValue  = "created"
	StartedTaskControlStateValue  = "started"
	RejectedTaskControlStateValue = "rejected"
	FinishedTaskControlStateValue = "finished"
)

func DefaultTaskControlStatus() []*TaskControlState {
	return []*TaskControlState{
		{Name: "Creada", Value: CreatedTaskControlStateValue},
		{Name: "Iniciada", Value: StartedTaskControlStateValue},
		{Name: "Rechazada", Value: RejectedTaskControlStateValue},
		{Name: "Finalizada", Value: FinishedTaskControlStateValue},
	}
}
