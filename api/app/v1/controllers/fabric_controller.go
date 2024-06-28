package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type FabricController struct {
	repository.FabricRepository
}

// Get the fabrics
// @Summary      Get fabrics from db
// @Description  Get all the fabrics, limit for query o default limit
// @Tags         fabrics
// @Produce      json
// @Success      200 {array} models.Fabric
// @Failure      400
// @Failure      500
// @Router       /fabrics [get]
func (m *FabricController) ReadFabrics(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.FabricBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.FabricBadRequest()
	}

	// get fabrics
	fabrics, err := m.SelectFabrics(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, fabrics)

}

func (m *FabricController) AggregateFabrics(c echo.Context) error {
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

	// aggregate
	aggregate, err := m.FabricRepository.AggregationFabrics(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, aggregate)

}
