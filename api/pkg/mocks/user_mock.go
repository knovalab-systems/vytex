package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) CheckUserExistence(username string) (bool, error) {
	args := m.Called()
	return args.Bool(0), args.Error(1)
}

func (m *UserMock) SelectUsers(req *models.Query) ([]*models.User, error) {
	args := m.Called()
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectUser(req *models.ReadUser) (*models.User, error) {
	args := m.Called()
	return &models.User{}, args.Error(0)
}

func (m *UserMock) AggregationUsers(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *UserMock) UpdateUser(update *models.UpdateUserBody) (*models.User, error) {
	args := m.Called()
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *UserMock) CreateUser(body *models.CreateUserBody) (*models.User, error) {
	args := m.Called()
	return args.Get(0).(*models.User), args.Error(1)
}
