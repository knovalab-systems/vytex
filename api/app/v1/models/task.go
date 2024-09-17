package models

type Task struct {
	ID     uint      `json:"id,omitempty" gorm:"primary_key"`
	Name   string    `json:"name,omitempty"`
	Value  TaskValue `json:"value,omitempty" gorm:"type:text"`
	StepID uint      `json:"step_id,omitempty"`
	Step   Step      `json:"step,omitempty"`
}

type TaskValue string

const (
	Trazar    = "trazar"
	Plantear  = "plantear"
	Tender    = "tender"
	Cortar    = "cortar"
	Paquetear = "paquetear"
)

func DefaultTasks(corte uint) []*Task {
	return []*Task{
		{Name: "Trazar", Value: Trazar, StepID: corte},
		{Name: "Plantear", Value: Plantear, StepID: corte},
		{Name: "Tender", Value: Tender, StepID: corte},
		{Name: "Cortar", Value: Cortar, StepID: corte},
		{Name: "Paquetear", Value: Paquetear, StepID: corte},
	}
}
