package services

import (
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type TaskControlStateService struct {
}

func (m *TaskControlStateService) SelectTaskControlStatus(q *models.Query) ([]*models.TaskControlState, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.TaskControlState
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.TaskControlStateFields(s, q.Fields)
	}

	// run query
	taskControlStatus, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return taskControlStatus, nil

}
