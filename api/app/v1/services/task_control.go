package services

import (
	"errors"
	"slices"
	"strings"
	"time"

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

func (m *TaskControlService) AggregationTaskControls(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.TaskControl
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.TaskControlFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ResourceBadRequest()
		}
	}

	if q.Count != "" {
		countArr := strings.Split(q.Count, ",")
		countObj := make(map[string]int64)

		for _, v := range countArr {
			switch v {
			case "id":
				count, err := s.Select(table.ID).Count()
				if err != nil {
					return nil, problems.ServerError()
				}
				countObj["id"] = count
			default:
				if aggregateElem.Count == nil {
					count, err := s.Count()
					if err != nil {
						return nil, problems.ServerError()
					}
					aggregateElem.Count = &count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil
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
		{Step: models.Confeccion, Policy: models.UpdateConfeccion},
	}

	for _, v := range stepsByPolicy {
		if taskControl.Task.Step.Value == v.Step && slices.Contains(p, string(v.Policy)) {
			now := time.Now()

			if b.StartedAt != nil && taskControl.StartedAt == nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				return startTaskControl(taskControl, &now)
			}

			if b.RejectedAt != nil && taskControl.StartedAt == nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				return rejectTaskControl(taskControl, &now)
			}

			if b.FinishedAt != nil && taskControl.StartedAt != nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				return finishTaskControl(taskControl, &now)
			}

			return nil, problems.ReadAccess()
		}
	}

	return nil, problems.ReadAccess()
}

func startTaskControl(taskControl *models.TaskControl, now *time.Time) (*models.TaskControl, error) {
	taskControl.StartedAt = now
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	order, err := query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	var newStateValue models.OrderStateValue
	switch taskControl.Task.Step.Value {
	case models.Corte:
		newStateValue = models.CorteOrderStateValue
	case models.Confeccion:
		newStateValue = models.ConfeccionOrderStateValue
	default:
		return nil, problems.ServerError()
	}

	orderState, err := query.OrderState.Where(query.OrderState.Value.Eq(string(newStateValue))).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	order.OrderStateID = orderState.ID
	_, err = query.Order.Where(query.Order.ID.Eq(order.ID)).Updates(order)
	if err != nil {
		return nil, problems.ServerError()
	}

	return taskControl, nil
}

func rejectTaskControl(taskControl *models.TaskControl, now *time.Time) (*models.TaskControl, error) {
	taskControl.RejectedAt = now
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	if taskControl.PreviousID == nil {
		order, err := query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).First()
		if err != nil {
			return nil, problems.ServerError()
		}
		order.CanceledAt = now

		canceledState, err := query.OrderState.Where(query.OrderState.Value.Eq(models.CanceledOrderStateValue)).First()
		if err != nil {
			return nil, problems.ServerError()
		}
		order.OrderStateID = canceledState.ID

		rows, err = query.Order.Where(query.Order.ID.Eq(order.ID)).Updates(order)
		if err != nil || rows.RowsAffected == 0 {
			return nil, problems.ServerError()
		}
	} else {
		rows, err = query.TaskControl.Where(query.TaskControl.ID.Eq(*taskControl.PreviousID)).Updates(map[string]interface{}{"finished_at": nil, "next_id": nil})
		if err != nil || rows.RowsAffected == 0 {
			return nil, problems.ServerError()
		}
	}

	return taskControl, nil
}

func finishTaskControl(taskControl *models.TaskControl, now *time.Time) (*models.TaskControl, error) {
	nextTaskControl := &models.TaskControl{PreviousID: &taskControl.ID, OrderID: taskControl.OrderID}

	switch taskControl.Task.Value {
	case models.Trazar:
		task, err := helpers.GetTaskByValue(models.Plantear)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Plantear:
		task, err := helpers.GetTaskByValue(models.Tender)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Tender:
		task, err := helpers.GetTaskByValue(models.Cortar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Cortar:
		task, err := helpers.GetTaskByValue(models.Paquetear)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Paquetear:
		task, err := helpers.GetTaskByValue(models.Filetear)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID

	case models.Filetear:
		task, err := helpers.GetTaskByValue(models.ArmarEspalda)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.ArmarEspalda:
		task, err := helpers.GetTaskByValue(models.TaparVarilla)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.TaparVarilla:
		task, err := helpers.GetTaskByValue(models.FigurarAbrochadura)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.FigurarAbrochadura:
		task, err := helpers.GetTaskByValue(models.CerrarCostado)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.CerrarCostado:
		task, err := helpers.GetTaskByValue(models.MarquillaSesgar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.MarquillaSesgar:
		task, err := helpers.GetTaskByValue(models.GafeteMangas)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.GafeteMangas:
		task, err := helpers.GetTaskByValue(models.Presillar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Presillar:
		order, err := query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).First()
		if err != nil {
			return nil, problems.ServerError()
		}

		finishedState, err := query.OrderState.Where(query.OrderState.Value.Eq(models.FinishedOrderStateValue)).First()
		if err != nil {
			return nil, problems.ServerError()
		}

		order.FinishedAt = now
		order.OrderStateID = finishedState.ID

		rows, err := query.Order.Where(query.Order.ID.Eq(order.ID)).Updates(order)
		if err != nil || rows.RowsAffected == 0 {
			return nil, problems.ServerError()
		}

		nextTaskControl = nil
	default:
		return nil, problems.ReadAccess()
	}

	if nextTaskControl != nil {
		err := query.TaskControl.Create(nextTaskControl)
		if err != nil {
			return nil, problems.ServerError()
		}
		taskControl.NextID = &nextTaskControl.ID
	}

	taskControl.FinishedAt = now
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	return taskControl, nil
}
