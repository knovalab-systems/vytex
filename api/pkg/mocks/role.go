package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type RoleMock struct {
	mock.Mock
}

func (m *RoleMock) SelectRoles(req *models.Query) ([]*models.Role, error) {
	args := m.Called()
	return []*models.Role{}, args.Error(0)
}
