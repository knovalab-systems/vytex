package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ResourceMock struct {
	mock.Mock
}

func (m *ResourceMock) SelectResources(req *models.Query) ([]*models.ResourceV, error) {
	args := m.Called()
	return []*models.ResourceV{}, args.Error(0)
}
