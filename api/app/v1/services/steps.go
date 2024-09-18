package services

import (
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type StepService struct {
}

func (m *StepService) SelectSteps(q *models.Query) ([]*models.Step, error) {
	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Step
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.StepFields(s, q.Fields)
	}

	// run query
	steps, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return steps, nil
}
