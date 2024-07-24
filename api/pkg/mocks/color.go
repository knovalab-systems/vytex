package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ColorMock struct {
	mock.Mock
}

func (m *ColorMock) SelectColors(q *models.Query) ([]*models.Color, error) {
	args := m.Called()
	return []*models.Color{}, args.Error(0)
}

func (m *ColorMock) SelectColor(req *models.ReadColor) (*models.Color, error) {
	args := m.Called()
	return &models.Color{}, args.Error(0)
}

func (m *ColorMock) AggregationColors(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(q)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *ColorMock) CreateColor(u *models.ColorCreateBody) (*models.Color, error) {
	args := m.Called(u)
	return args.Get(0).(*models.Color), args.Error(1)
}

func (m *ColorMock) UpdateColor(b *models.ColorUpdateBody) (*models.Color, error) {
	args := m.Called()
	return args.Get(0).(*models.Color), args.Error(1)
}
