package mocks

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/lib/pq"
	"github.com/stretchr/testify/mock"
)

type TaskControlMock struct {
	mock.Mock
}

func (m *TaskControlMock) AggregationTaskControls(req *models.AggregateQuery) ([]*models.AggregateData, error) {
	args := m.Called(req)
	return []*models.AggregateData{args.Get(0).(*models.AggregateData)}, args.Error(1)
}

func (m *TaskControlMock) SelectTaskControls(req *models.Query) ([]*models.TaskControl, error) {
	args := m.Called()
	return []*models.TaskControl{}, args.Error(0)
}

func (m *TaskControlMock) UpdateTaskControl(b *models.TaskControlUpdateBody, p pq.StringArray) (*models.TaskControl, error) {
	args := m.Called()
	return args.Get(0).(*models.TaskControl), args.Error(1)
}
