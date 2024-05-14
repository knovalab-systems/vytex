package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type UserMock struct {
	mock.Mock
}

func (m *UserMock) SelectUserByName(request *models.Request, s string) ([]*models.User, error) {
	args := m.Called(request, s)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectUserByUsername(request *models.Request, s string) ([]*models.User, error) {
	args := m.Called(request, s)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectDisabledUsers(request *models.Request) ([]*models.User, error) {
	args := m.Called(request)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectEnabledUsers(request *models.Request) ([]*models.User, error) {
	args := m.Called(request)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) SelectUsers(req *models.Request) ([]*models.User, error) {
	args := m.Called(req)
	return []*models.User{}, args.Error(0)
}

func (m *UserMock) AggregationUsers(req *models.AggregateRequest) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}
