package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type TaskControlController struct {
	repository.TaskControlRepository
}

// Get the task controls
// @Summary      Get task controls from db
// @Description  Get all the task controls, limit for query o default limit
// @Tags         TaskControls
// @Produce      json
// @Success      200 {array} models.TaskControl
// @Failure      400
// @Failure      500
// @Router       /task-controls [get]
func (m *TaskControlController) ReadTaskControls(c echo.Context) error {
	// for query params
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// get taskControls
	taskControls, err := m.TaskControlRepository.SelectTaskControls(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, taskControls)
}

// Get aggregate from taskControls
// @Summary      Get aggregate from taskControls
// @Description  Get result of aggregate function from taskControls
// @Tags         TaskControlers
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /task-controls/aggregate [get]
func (m *TaskControlController) AggregateTaskControls(c echo.Context) error {
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// get taskControls
	taskControls, err := m.TaskControlRepository.AggregationTaskControls(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, taskControls)
}

// Update task control
// @Summary      Update task control
// @Description  Updates the fields from task control
// @Tags         TaskControls
// @Param		 taskControlId path string true "Task control ID"
// @Param		 models.TaskControlUpdateBody body string true "Task control update values"
// @Produce      json
// @Success      200 {object} models.TaskControl
// @Failure      400
// @Failure      500
// @Router       /task-controls/{taskControlId} [PATCH]
func (m *TaskControlController) UpdateTaskControl(c echo.Context) error {
	u := new(models.TaskControlUpdateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateTaskControlBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateTaskControlBadRequest()
	}

	policies, ok := c.Get("policies").(pq.StringArray)
	if !ok {
		return problems.ServerError()
	}

	// update
	taskControl, err := m.TaskControlRepository.UpdateTaskControl(u, policies)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, taskControl)
}
