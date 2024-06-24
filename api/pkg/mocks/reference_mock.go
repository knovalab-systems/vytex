package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type ReferenceMock struct {
	mock.Mock
}

func (m *ReferenceMock) CreateReference(req *models.ReferenceCreateBody) (*models.Reference, error) {
	args := m.Called()
	return &models.Reference{}, args.Error(0)
}
