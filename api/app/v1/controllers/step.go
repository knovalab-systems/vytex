package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type StepController struct {
	repository.StepRepository
}

// Get the steps
// @Summary      Get steps from db
// @Description  Get all the steps, limit for query o default limit
// @Tags         Steps
// @Produce      json
// @Success      200 {array} models.Step
// @Failure      400
// @Failure      500
// @Router       /steps [get]
func (m *StepController) ReadSteps(c echo.Context) error {
	// for query params
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.StepBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.StepBadRequest()
	}

	// get steps
	steps, err := m.StepRepository.SelectSteps(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, steps)
}
