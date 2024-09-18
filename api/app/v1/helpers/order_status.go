package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetOrderStatusByValue(value models.OrderStateValue) (*models.OrderState, error) {
	table := query.OrderState
	return table.Where(table.Value.Eq(string(value))).First()
}
