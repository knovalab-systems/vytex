package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type SupplierMock struct {
	mock.Mock
}

func (m *SupplierMock) SelectSuppliers(req *models.Query) ([]*models.Supplier, error) {
	args := m.Called()
	return []*models.Supplier{}, args.Error(0)
}

func (m *SupplierMock) AggregationSuppliers(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *SupplierMock) CreateSupplier(u *models.SupplierCreateBody) (*models.Supplier, error) {
	args := m.Called(u)
	return args.Get(0).(*models.Supplier), args.Error(1)
}
