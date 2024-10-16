package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type TaskControlStateMock struct {
	mock.Mock
}

func (m *TaskControlStateMock) SelectTaskControlStatus(req *models.Query) ([]*models.TaskControlState, error) {
	args := m.Called()
	return []*models.TaskControlState{}, args.Error(0)
}
