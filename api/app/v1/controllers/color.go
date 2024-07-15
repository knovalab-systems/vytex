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
// @Tags         Colors
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

// Get aggregate from colors
// @Summary      Get aggregate from colors
// @Description  Get result of aggregate function from colors
// @Tags         Colors
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /colors/aggregate [get]
func (m *ColorController) AggregateColors(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateColorsBadRequest()
	}

	// aggegation
	aggregate, err := m.ColorRepository.AggregationColors(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}

// Create color
// @Summary      Create color
// @Description  Create a new color
// @Tags         Colors
// @Produce      json
// @Param		 models.ColorCreateBody body string true "Color create values"
// @Success      201 {object} models.Color
// @Failure      400
// @Failure      409
// @Failure      500
// @Router       /colors [post]
func (m *ColorController) CreateColor(c echo.Context) error {
	u := new(models.ColorCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateColorBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateColorBadRequest()
	}

	// create
	color, err := m.ColorRepository.CreateColor(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, color)
}