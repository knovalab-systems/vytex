package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) SelectUsers() ([]*models.User, error) {
	args := m.Called()
	return []*models.User{}, args.Error(0)
}
