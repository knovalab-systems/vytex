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

func (m *ReferenceMock) SelectReference(resource *models.ReferenceRead) (*models.Reference, error) {
	args := m.Called()
	return &models.Reference{}, args.Error(0)
}

func (m *ReferenceMock) SelectReferenceImages(resource *models.ReferenceRead) ([]byte, error) {
	args := m.Called()
	return args.Get(0).([]byte), args.Error(1)
}

func (m *ReferenceMock) AggregationReferences(req *models.AggregateQuery) (*[]map[string]interface{}, error) {
	args := m.Called(req)
	return &[]map[string]interface{}{args.Get(0).(map[string]interface{})}, args.Error(1)
}
func (m *ReferenceMock) CreateReference(req *models.ReferenceCreateBody) (*models.Reference, error) {
	args := m.Called()
	return &models.Reference{}, args.Error(0)
}

func (m *ReferenceMock) UpdateTimesReference(body *models.TimeByTaskReferenceUpdate) (*models.Reference, error) {
	args := m.Called()
	return args.Get(0).(*models.Reference), args.Error(1)
}
