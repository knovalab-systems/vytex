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
	CorteOrderStateValue      = "corte"
	ConfeccionOrderStateValue = "confeccion"
	CalidadOrderStateValue    = "calidad"
	EmpaqueOrderStateValue    = "empaque"
	FinishedOrderStateValue   = "finished"
	CanceledOrderStateValue   = "canceled"
)

func DefaultOrderStatus() []*OrderState {
	return []*OrderState{
		{Name: "Creada", Value: CreatedOrderStateValue},
		{Name: "Iniciada", Value: StartedOrderStateValue},
		{Name: "Corte", Value: CorteOrderStateValue},
		{Name: "Confección", Value: ConfeccionOrderStateValue},
		{Name: "Calidad", Value: CalidadOrderStateValue},
		{Name: "Empaque", Value: EmpaqueOrderStateValue},
		{Name: "Finalizada", Value: FinishedOrderStateValue},
		{Name: "Cancelada", Value: CanceledOrderStateValue},
	}
}
