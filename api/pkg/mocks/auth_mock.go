package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
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

func (m *AuthMock) Credentials(user string, role string) (*models.Tokens, error) {
	args := m.Called(user, role)
	return args.Get(0).(*models.Tokens), args.Error(1)
}

func (m *AuthMock) ValidRefresh(token string) (*models.Session, error) {
	args := m.Called(token)
	return args.Get(0).(*models.Session), args.Error(1)
}
