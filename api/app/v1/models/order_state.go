package models

type OrderState struct {
	ID    uint            `json:"id,omitempty" gorm:"primary_key"`
	Name  string          `json:"name"`
	Value OrderStateValue `json:"value" gorm:"type:text"`
}

type OrderStateValue string

const (
	CreatedOrderStateValue = "created"
	StartedOrderStateValue = "started"
)

func DefaultOrderStatus() []*OrderState {
	return []*OrderState{
		{Name: "Creada", Value: CreatedOrderStateValue},
		{Name: "Iniciada", Value: StartedOrderStateValue},
	}
}