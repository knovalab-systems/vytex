package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) SelectUsers(req *models.Request) ([]*models.User, error) {
	args := m.Called(req)
	return []*models.User{}, args.Error(0)
}
