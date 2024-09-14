package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type OrderStateController struct {
	repository.OrderStateRepository
}

// Get the order status
// @Summary      Get order status from db
// @Description  Get all the order status, limit for query o default limit
// @Tags         Orders
// @Produce      json
// @Success      200 {array} models.OrderState
// @Failure      400
// @Failure      500
// @Router       /order-status [get]
func (m *OrderStateController) ReadOrderStatus(c echo.Context) error {
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.OrdersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.OrdersBadRequest()
	}

	// get order status
	orders, err := m.OrderStateRepository.SelectOrderStatus(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, orders)
}
