package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetOrderStatusByValue(value models.OrderStatusValues) (*models.OrderStatus, error) {
	table := query.OrderStatus
	return table.Where(table.Value.Eq(string(value))).First()
}
