package models

type OrderStatus struct {
	ID    uint              `json:"id,omitempty" gorm:"primary_key"`
	Name  string            `json:"name"`
	Value OrderStatusValues `json:"value" gorm:"type:text"`
}

type OrderStatusValues string

const (
	CreatedOrderStatusValue = "created"
	StartedOrderStatusValue = "started"
)

func CreatedOrderStatus() *OrderStatus {
	return &OrderStatus{
		Name:  "Creada",
		Value: CreatedOrderStatusValue,
	}
}

func StartedOrderStatus() *OrderStatus {
	return &OrderStatus{
		Name:  "Iniciada",
		Value: StartedOrderStatusValue,
	}
}
