package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ResourceMock struct {
	mock.Mock
}

func (m *ResourceMock) SelectResources(req *models.Query) ([]*models.Resource, error) {
	args := m.Called()
	return []*models.Resource{}, args.Error(0)
}

func (m *ResourceMock) SelectResource(resource *models.ResourceRead) (*models.Resource, error) {
	args := m.Called()
	return &models.Resource{}, args.Error(0)
}

func (m *ResourceMock) AggregationResources(req *models.AggregateQuery) (*[]map[string]interface{}, error) {
	args := m.Called(req)
	return &[]map[string]interface{}{args.Get(0).(map[string]interface{})}, args.Error(1)
}

func (m *ResourceMock) CreateResource(u *models.ResourceCreateBody) (*models.Resource, error) {
	args := m.Called(u)
	return args.Get(0).(*models.Resource), args.Error(1)
}

func (m *ResourceMock) UpdateResource(body *models.ResourceUpdateBody) (*models.Resource, error) {
	args := m.Called()
	return args.Get(0).(*models.Resource), args.Error(1)
}
