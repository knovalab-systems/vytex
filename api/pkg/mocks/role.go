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

func (m *RoleMock) SelectRole(req *models.RoleRead) (*models.Role, error) {
	args := m.Called()
	return &models.Role{}, args.Error(0)
}

func (m *RoleMock) AggregationRoles(req *models.AggregateQuery) (*[]map[string]interface{}, error) {
	args := m.Called(req)
	return &[]map[string]interface{}{args.Get(0).(map[string]interface{})}, args.Error(1)
}

func (m *RoleMock) CreateRole(u *models.RoleCreateBody) (*models.Role, error) {
	args := m.Called(u)
	return args.Get(0).(*models.Role), args.Error(1)
}

func (m *RoleMock) UpdateRole(u *models.RoleUpdateBody) (*models.Role, error) {
	args := m.Called()
	return args.Get(0).(*models.Role), args.Error(1)
}
