package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type CustomMock struct {
	mock.Mock
}

func (m *CustomMock) SelectCustoms(q *models.Query) ([]*models.Custom, error) {
	args := m.Called()
	return []*models.Custom{}, args.Error(0)
}

func (m *CustomMock) AggregationCustoms(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(q)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *CustomMock) CreateCustom(req *models.CustomCreateBody) (*models.Custom, error) {
	args := m.Called()
	return &models.Custom{}, args.Error(0)
}
