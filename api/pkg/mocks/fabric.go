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

func (m *FabricMock) SelectFabric(resource *models.FabricRead) (*models.Fabric, error) {
	args := m.Called()
	return &models.Fabric{}, args.Error(0)
}

func (m *FabricMock) AggregationFabrics(req *models.AggregateQuery) (*[]map[string]interface{}, error) {
	args := m.Called(req)
	return &[]map[string]interface{}{args.Get(0).(map[string]interface{})}, args.Error(1)
}

func (m *FabricMock) CreateFabric(u *models.FabricCreateBody) (*models.Fabric, error) {
	args := m.Called(u)
	return args.Get(0).(*models.Fabric), args.Error(1)
}

func (m *FabricMock) UpdateFabric(body *models.FabricUpdateBody) (*models.Fabric, error) {
	args := m.Called()
	return args.Get(0).(*models.Fabric), args.Error(1)
}
