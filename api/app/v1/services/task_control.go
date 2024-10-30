package services

import (
	"errors"
	"slices"
	"strings"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/sorts"

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

	if q.Sort != "" {
		s = sorts.TaskControlSorts(s, q.Sort)
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
		{Step: models.Calidad, Policy: models.UpdateCalidad},
		{Step: models.Empaque, Policy: models.UpdateEmpaque},
	}

	for _, v := range stepsByPolicy {
		if taskControl.Task.Step.Value == v.Step && slices.Contains(p, string(v.Policy)) {
			now := time.Now()

			if b.StartedAt != nil && taskControl.StartedAt == nil && taskControl.RejectedAt == nil && taskControl.FinishedAt == nil {
				taskControl.StartedAt = &now
				return startTaskControl(taskControl)
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

func startTaskControl(taskControl *models.TaskControl) (*models.TaskControl, error) {
	taskState, err := helpers.GetTaskControlStateByValue(models.StartedTaskControlStateValue)
	if err != nil {
		return nil, problems.ServerError()
	}
	taskControl.TaskControlStateID = taskState.ID
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	var newStateValue models.OrderStateValue
	switch taskControl.Task.Value {
	case models.Trazar:
		newStateValue = models.CorteOrderStateValue
	case models.Filetear:
		newStateValue = models.ConfeccionOrderStateValue
	case models.Pulir:
		newStateValue = models.CalidadOrderStateValue
	case models.Bolsas:
		newStateValue = models.EmpaqueOrderStateValue
	default:
		return taskControl, nil
	}

	orderState, err := helpers.GetOrderStateByValue(newStateValue)
	if err != nil {
		return nil, problems.ServerError()
	}

	rows, err = query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).Updates(models.Order{OrderStateID: orderState.ID})
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	return taskControl, nil
}

func rejectTaskControl(taskControl *models.TaskControl, now *time.Time) (*models.TaskControl, error) {
	taskState, err := helpers.GetTaskControlStateByValue(models.RejectedTaskControlStateValue)
	if err != nil {
		return nil, problems.ServerError()
	}
	taskControl.TaskControlStateID = taskState.ID
	taskControl.RejectedAt = now
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	if taskControl.PreviousID == nil {
		canceledState, err := helpers.GetOrderStateByValue(models.CanceledOrderStateValue)
		if err != nil {
			return nil, problems.ServerError()
		}

		rows, err = query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).Updates(models.Order{OrderStateID: canceledState.ID, CanceledAt: now})
		if err != nil || rows.RowsAffected == 0 {
			return nil, problems.ServerError()
		}
	} else {
		taskState, err := helpers.GetTaskControlStateByValue(models.RejectedTaskControlStateValue)
		if err != nil {
			return nil, problems.ServerError()
		}
		rows, err = query.TaskControl.Where(query.TaskControl.ID.Eq(*taskControl.PreviousID)).Updates(map[string]interface{}{"finished_at": nil, "next_id": nil,
			"task_control_state_id": taskState.ID})
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
		task, err := helpers.GetTaskByValue(models.Pulir)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Pulir:
		task, err := helpers.GetTaskByValue(models.Revisar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Revisar:
		task, err := helpers.GetTaskByValue(models.Acabados)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Acabados:
		task, err := helpers.GetTaskByValue(models.Bolsas)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Bolsas:
		task, err := helpers.GetTaskByValue(models.Tiquetear)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Tiquetear:
		task, err := helpers.GetTaskByValue(models.Empacar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Empacar:
		task, err := helpers.GetTaskByValue(models.Organizar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Organizar:
		task, err := helpers.GetTaskByValue(models.Grabar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Grabar:
		task, err := helpers.GetTaskByValue(models.Paletizar)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskID = task.ID
	case models.Paletizar:
		finishedState, err := helpers.GetOrderStateByValue(models.FinishedOrderStateValue)
		if err != nil {
			return nil, problems.ServerError()
		}

		rows, err := query.Order.Where(query.Order.ID.Eq(taskControl.OrderID)).Updates(models.Order{OrderStateID: finishedState.ID, FinishedAt: now})
		if err != nil || rows.RowsAffected == 0 {
			return nil, problems.ServerError()
		}

		nextTaskControl = nil
	default:
		return nil, problems.ReadAccess()
	}

	if nextTaskControl != nil {
		taskState, err := helpers.GetTaskControlStateByValue(models.CreatedTaskControlStateValue)
		if err != nil {
			return nil, problems.ServerError()
		}
		nextTaskControl.TaskControlStateID = taskState.ID
		err = query.TaskControl.Create(nextTaskControl)
		if err != nil {
			return nil, problems.ServerError()
		}
		taskControl.NextID = &nextTaskControl.ID
	}

	taskState, err := helpers.GetTaskControlStateByValue(models.FinishedTaskControlStateValue)
	if err != nil {
		return nil, problems.ServerError()
	}
	taskControl.TaskControlStateID = taskState.ID
	taskControl.FinishedAt = now
	rows, err := query.TaskControl.Where(query.TaskControl.ID.Eq(taskControl.ID)).Updates(taskControl)
	if err != nil || rows.RowsAffected == 0 {
		return nil, problems.ServerError()
	}

	return taskControl, nil
}
