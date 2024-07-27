package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type OrderMock struct {
	mock.Mock
}

func (m *OrderMock) CreateOrder(req *models.OrderCreateBody) (*models.Order, error) {
	args := m.Called()
	return &models.Order{}, args.Error(0)
}
