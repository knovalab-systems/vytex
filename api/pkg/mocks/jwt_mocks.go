package mocks

import (
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/stretchr/testify/mock"
)

type TokenMock struct {
	mock.Mock
}

func (m *TokenMock) GenerateTokens(id string) (*utils.Tokens, error) {
	args := m.Called(id)
	return &utils.Tokens{
		Access:  "",
		Refresh: "",
	}, args.Error(0)
}
