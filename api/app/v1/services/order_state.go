package services

import (
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type OrderStateService struct {
}

func (m *OrderStateService) SelectOrderStatus(q *models.Query) ([]*models.OrderState, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.OrderState
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = fields.Fields(s, q.Fields).(query.IOrderStateDo)

	// run query
	orderStatus, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return orderStatus, nil

}
