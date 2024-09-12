package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetOrderStatusByValue(value models.OrderStateValues) (*models.OrderState, error) {
	table := query.OrderState
	return table.Where(table.Value.Eq(string(value))).First()
}
