package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type CustomController struct {
	repository.CustomRepository
}

// Get the customs
// @Summary      Get customs from db
// @Description  Get all the customs, limit for query o default limit
// @Tags         Customs
// @Produce      json
// @Success      200 {array} models.Custom
// @Failure      400
// @Failure      500
// @Router       /customs [get]
func (m *CustomController) ReadCustoms(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CustomsBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CustomsBadRequest()
	}

	// get customs
	customs, err := m.CustomRepository.SelectCustoms(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, customs)

}

// Get aggregate from customs
// @Summary      Get aggregate from customs
// @Description  Get result of aggregate function from customs
// @Tags         Customs
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /customs/aggregate [get]
func (m *CustomController) AggregateCustoms(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateCustomsBadRequest()
	}

	// aggegation
	aggregate, err := m.CustomRepository.AggregationCustoms(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}
