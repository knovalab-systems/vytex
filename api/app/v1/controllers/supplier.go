package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type SupplierController struct {
	repository.SupplierRepository
}

// Get the suppliers
// @Summary      Get suppliers from db
// @Description  Get all the suppliers, limit for query o default limit
// @Tags         Suppliers
// @Produce      json
// @Success      200 {array} models.Supplier
// @Failure      400
// @Failure      500
// @Router       /suppliers [get]
func (m *SupplierController) ReadSuppliers(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.SuppliersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.SuppliersBadRequest()
	}

	// get suppliers
	suppliers, err := m.SupplierRepository.SelectSuppliers(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, suppliers)

}

// Get aggregate from suppliers
// @Summary      Get aggregate from suppliers
// @Description  Get result of aggregate function from suppliers
// @Tags         Suppliers
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /suppliers/aggregate [get]
func (m *SupplierController) AggregateSuppliers(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateSuppliersBadRequest()
	}

	// aggegation
	aggregate, err := m.SupplierRepository.AggregationSuppliers(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}

// Create supplier
// @Summary      Create supplier
// @Description  Create a new supplier
// @Tags         Suppliers
// @Produce      json
// @Param		 models.SupplierCreateBody body string true "Supplier create values"
// @Success      201 {object} models.Supplier
// @Failure      400
// @Failure      409
// @Failure      500
// @Router       /suppliers [post]
func (m *SupplierController) CreateSupplier(c echo.Context) error {
	u := new(models.SupplierCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateSupplierBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateSupplierBadRequest()
	}

	// create
	supplier, err := m.SupplierRepository.CreateSupplier(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, supplier)
}
