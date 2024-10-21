package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type TaskControlStateController struct {
	repository.TaskControlStateRepository
}

// Get the task control status
// @Summary      Get task control status from db
// @Description  Get all the task control status, limit for query o default limit
// @Tags         TaskControlStatus
// @Produce      json
// @Success      200 {array} models.TaskControlState
// @Failure      400
// @Failure      500
// @Router       /task-control-status [get]
func (m *TaskControlStateController) ReadTaskControlStatus(c echo.Context) error {
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.TaskControlBadRequest()
	}

	// get task contrl status
	status, err := m.TaskControlStateRepository.SelectTaskControlStatus(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, status)
}
