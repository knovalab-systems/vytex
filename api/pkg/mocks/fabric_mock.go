package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type FabricMock struct {
	mock.Mock
}

func (m *FabricMock) SelectFabrics(req *models.Query) ([]*models.Fabric, error) {
	args := m.Called()
	return []*models.Fabric{}, args.Error(0)
}

func (m *FabricMock) AggregationFabrics(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}
