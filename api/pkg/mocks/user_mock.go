package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) GetUserFilter(u *models.Request) (models.UserFilter, error) {
	args := m.Called(u)
	return args.Get(0).(models.UserFilter), args.Error(1)
}

func (m *UserMock) SelectUsersByFilter(filter *models.UserFilter, req *models.Request) ([]*models.User, error) {
	args := m.Called(filter, req)
	return []*models.User{}, args.Error(1)
}

func (m *UserMock) SelectUsers(req *models.Request) ([]*models.User, error) {
	args := m.Called(req)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) AggregationUsers(req *models.AggregateRequest) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}
