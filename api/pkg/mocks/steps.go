package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type StepMock struct {
	mock.Mock
}

func (m *StepMock) SelectSteps(req *models.Query) ([]*models.Step, error) {
	args := m.Called()
	return []*models.Step{}, args.Error(0)
}
