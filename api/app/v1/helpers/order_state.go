package helpers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

func GetOrderStateByValue(value models.OrderStateValue) (*models.OrderState, error) {
	table := query.OrderState
	return table.Where(table.Value.Eq(string(value))).First()
}
