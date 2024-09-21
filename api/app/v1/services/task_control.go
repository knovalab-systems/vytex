package services

import (
	"errors"
	"log"
	"slices"

	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"github.com/lib/pq"
	"gorm.io/gorm"
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

func (m *TaskControlService) UpdateTaskControl(b *models.TaskControlUpdateBody, p pq.StringArray) (*models.TaskControl, error) {

	table := query.TaskControl
	taskTable := query.Task
	stepTable := query.Step

	taskControl, err := table.Preload(table.Task.Select(taskTable.ID, taskTable.StepID, taskTable.Value)).
		Preload(table.Task.Step.Select(stepTable.ID, stepTable.Value)).Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	stepsByPolicy := []struct {
		Step   models.StepValue
		Policy models.Policy
	}{
		{Step: models.Corte, Policy: models.UpdateCorte},
	}

	for _, v := range stepsByPolicy {
		if taskControl.Task.Step.Value == v.Step && slices.Contains(p, string(v.Policy)) {

			if b.StartedAt != nil && taskControl.StartedAt == nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				taskControl.StartedAt = b.StartedAt
				rows, err := table.Where(table.ID.Eq(taskControl.ID)).Updates(taskControl)
				if err != nil {
					return nil, problems.ServerError()
				}

				if rows.RowsAffected == 0 {
					return nil, problems.ReadAccess()
				}

				return taskControl, nil
			}

			if b.RejectedAt != nil && taskControl.StartedAt == nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				taskControl.RejectedAt = b.RejectedAt
				rows, err := table.Where(table.ID.Eq(taskControl.ID)).Updates(taskControl)
				if err != nil {
					return nil, problems.ServerError()
				}

				if rows.RowsAffected == 0 {
					return nil, problems.ReadAccess()
				}

				if taskControl.PreviousID != nil {
					rows, err = table.Where(table.ID.Eq(*taskControl.PreviousID)).Updates(map[string]interface{}{"finished_at": nil, "next_id": nil})
					if err != nil {
						return nil, problems.ServerError()
					}

					if rows.RowsAffected == 0 {
						return nil, problems.ReadAccess()
					}

				}

				return taskControl, nil

			}

			if b.FinishedAt != nil && taskControl.StartedAt != nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				nextTaskControl := &models.TaskControl{PreviousID: &taskControl.ID, OrderID: taskControl.OrderID}

				switch taskControl.Task.Value {
				case models.Plantear:
					task, err := helpers.GetTaskByValue(models.Tender)
					if err != nil {
						return nil, problems.ServerError()
					}
					nextTaskControl.TaskID = task.ID
					err = query.TaskControl.Create(nextTaskControl)
					if err != nil {
						return nil, problems.ServerError()
					}
					taskControl.NextID = &nextTaskControl.ID
				default:
					log.Println("Here")
					return nil, problems.ReadAccess()
				}

				taskControl.FinishedAt = b.FinishedAt
				rows, err := table.Where(table.ID.Eq(taskControl.ID)).Updates(taskControl)
				if err != nil {
					return nil, problems.ServerError()
				}

				if rows.RowsAffected == 0 {
					log.Println("Here 2")
					return nil, problems.ReadAccess()
				}

				return taskControl, nil

			}

			return nil, problems.ReadAccess()
		}
	}

	return nil, problems.ReadAccess()
}
