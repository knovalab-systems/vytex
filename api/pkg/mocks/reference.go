package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ReferenceMock struct {
	mock.Mock
}

func (m *ReferenceMock) SelectReferences(req *models.Query) ([]*models.Reference, error) {
	args := m.Called()
	return []*models.Reference{}, args.Error(0)
}

func (m *ReferenceMock) AggregationReferences(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *ReferenceMock) CreateReference(req *models.ReferenceCreateBody) (*models.Reference, error) {
	args := m.Called()
	return &models.Reference{}, args.Error(0)
}

func (m *ReferenceMock) UpdateTimesReference(body *models.TimeByTaskReferenceUpdate) (*models.Reference, error) {
	args := m.Called()
	return args.Get(0).(*models.Reference), args.Error(1)
}
