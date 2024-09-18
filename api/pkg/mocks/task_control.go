package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/mock"
)

type TaskControlMock struct {
	mock.Mock
}

func (m *TaskControlMock) SelectTaskControls(req *models.Query) ([]*models.TaskControl, error) {
	args := m.Called()
	return []*models.TaskControl{}, args.Error(0)
}
