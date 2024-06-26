package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ColorController struct {
	repository.ColorRepository
}

// Get the colors
// @Summary      Get colors from db
// @Description  Get all the colors, limit for query o default limit
// @Tags         colors
// @Produce      json
// @Success      200 {array} models.Color
// @Failure      400
// @Failure      500
// @Router       /colors [get]
func (m *ColorController) ReadColors(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ColorsBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.ColorsBadRequest()
	}

	// get colors
	colors, err := m.SelectColors(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, colors)

}

func (m *ColorController) AggregateColors(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateUsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.AggregateUsersBadRequest()
	}

	// aggegation
	aggregate, err := m.ColorRepository.AggregationColors(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)

}
