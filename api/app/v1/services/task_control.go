package services

import (
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type TaskControlService struct {
}

func (m *TaskControlService) SelectTaskControls(q *models.Query) ([]*models.TaskControl, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.TaskControl
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.TaskControlFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.TaskControlFilters(s, q.Filter)
		if err != nil {
			return nil, problems.UsersBadRequest()
		}
	}

	// run query
	taskControls, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return taskControls, nil
}
