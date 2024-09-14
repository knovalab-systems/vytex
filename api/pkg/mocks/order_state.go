package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type OrderStateMock struct {
	mock.Mock
}

func (m *OrderStateMock) SelectOrderStatus(req *models.Query) ([]*models.OrderState, error) {
	args := m.Called()
	return []*models.OrderState{}, args.Error(0)
}
