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
	Calidad    StepValue = "calidad"
	Empaque    StepValue = "empaque"
)

func DefaultSteps() []*Step {
	return []*Step{
		{Name: "Corte", Value: Corte},
		{Name: "Confección", Value: Confeccion},
		{Name: "Calidad", Value: Calidad},
		{Name: "Empaque", Value: Empaque},
	}
}
