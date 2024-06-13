package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ColorMock struct {
	mock.Mock
}

func (m *ColorMock) SelectColors(req *models.Query) ([]*models.Color, error) {
	args := m.Called()
	return []*models.Color{}, args.Error(0)
}
