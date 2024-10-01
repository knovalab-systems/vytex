package models

type OrderState struct {
	ID    uint            `json:"id,omitempty" gorm:"primary_key"`
	Name  string          `json:"name"`
	Value OrderStateValue `json:"value" gorm:"type:text"`
}

type OrderStateValue string

const (
	CreatedOrderStateValue    = "created"
	StartedOrderStateValue    = "started"
	CanceledOrderStateValue   = "canceled"
	FinishedOrderStateValue   = "finished"
	CorteOrderStateValue      = "corte"
	ConfeccionOrderStateValue = "confeccion"
)

func DefaultOrderStatus() []*OrderState {
	return []*OrderState{
		{Name: "Creada", Value: CreatedOrderStateValue},
		{Name: "Iniciada", Value: StartedOrderStateValue},
		{Name: "Cancelada", Value: CanceledOrderStateValue},
		{Name: "Finalizada", Value: FinishedOrderStateValue},
		{Name: "Corte", Value: CorteOrderStateValue},
		{Name: "Confección", Value: ConfeccionOrderStateValue},
	}
}
