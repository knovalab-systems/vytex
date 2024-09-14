package models

type OrderState struct {
	ID    uint             `json:"id,omitempty" gorm:"primary_key"`
	Name  string           `json:"name"`
	Value OrderStateValues `json:"value" gorm:"type:text"`
}

type OrderStateValues string

const (
	CreatedOrderStateValue = "created"
	StartedOrderStateValue = "started"
)

func CreatedOrderStatus() *OrderState {
	return &OrderState{
		Name:  "Creada",
		Value: CreatedOrderStateValue,
	}
}

func StartedOrderStatus() *OrderState {
	return &OrderState{
		Name:  "Iniciada",
		Value: StartedOrderStateValue,
	}
}
