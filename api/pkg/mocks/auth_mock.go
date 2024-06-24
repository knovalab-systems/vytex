package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/stretchr/testify/mock"
)

type AuthMock struct {
	mock.Mock
}

func (m *AuthMock) DeleteRefresh(id int) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *AuthMock) ValidUser(username string, password string) (*models.User, error) {
	args := m.Called(username, password)
	return args.Get(0).(*models.User), args.Error(1)
}

func (m *AuthMock) Credentials(user string, role string) (*utils.Tokens, error) {
	args := m.Called(user, role)
	return args.Get(0).(*utils.Tokens), args.Error(1)
}

func (m *AuthMock) ValidRefresh(token string) (*models.SessionWithRole, error) {
	args := m.Called(token)
	return args.Get(0).(*models.SessionWithRole), args.Error(1)
}
