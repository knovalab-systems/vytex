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
