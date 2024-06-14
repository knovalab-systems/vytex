package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type FabricMock struct {
	mock.Mock
}

func (m *FabricMock) SelectFabrics(req *models.Query) ([]*models.FabricV, error) {
	args := m.Called()
	return []*models.FabricV{}, args.Error(0)
}
