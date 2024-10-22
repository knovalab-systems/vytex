package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) SelectUsers(req *models.Query) ([]*models.User, error) {
	args := m.Called()
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectUser(req *models.UserRead) (*models.User, error) {
	args := m.Called()
	return &models.User{}, args.Error(0)
}

func (m *UserMock) AggregationUsers(req *models.AggregateQuery) (*[]map[string]interface{}, error) {
	args := m.Called(req)
	return &[]map[string]interface{}{args.Get(0).(map[string]interface{})}, args.Error(1)
}

func (m *UserMock) UpdateUser(update *models.UserUpdateBody) (*models.User, error) {
	args := m.Called()
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *UserMock) CreateUser(body *models.UserCreateBody) (*models.User, error) {
	args := m.Called()
	return args.Get(0).(*models.User), args.Error(1)
}
