package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type OrderMock struct {
	mock.Mock
}

func (m *OrderMock) SelectOrders(req *models.Query) ([]*models.Order, error) {
	args := m.Called()
	return []*models.Order{}, args.Error(0)
}

func (m *OrderMock) SelectOrder(req *models.OrderRead) (*models.Order, error) {
	args := m.Called()
	return &models.Order{}, args.Error(0)
}

func (m *OrderMock) AggregationOrders(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *OrderMock) CreateOrder(req *models.OrderCreateBody) (*models.Order, error) {
	args := m.Called()
	return &models.Order{}, args.Error(0)
}

func (m *OrderMock) UpdateOrder(u *models.OrderUpdateBody) (*models.Order, error) {
	args := m.Called()
	return args.Get(0).(*models.Order), args.Error(1)
}
