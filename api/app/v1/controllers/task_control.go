package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
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
