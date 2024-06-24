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
