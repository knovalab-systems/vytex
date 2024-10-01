package models

type Step struct {
	ID    uint      `json:"id,omitempty" gorm:"primary_key"`
	Name  string    `json:"name"`
	Value StepValue `json:"value" gorm:"type:text"`
	Tasks []Task    `json:"tasks" `
}

type StepValue string

const (
	Corte      StepValue = "corte"
	Confeccion StepValue = "confeccion"
)

func DefaultSteps() []*Step {
	return []*Step{
		{Name: "Corte", Value: Corte},
		{Name: "Confeccion", Value: Confeccion},
	}
}
