package controllers

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
	"net/http"
)

type OrderController struct {
	repository.OrderRepository
}

// Create order
// @Summary      Create an order
// @Description  Create a new order
// @Tags         Orders
// @Produce      json
// @Param        models.OrderCreateBody body models.OrderCreateBody true "Order create data"
// @Success      201 {object} models.Order
// @Failure      400
// @Failure      500
// @Router       /orders [post]
func (m *OrderController) CreateOrder(c echo.Context) error {
	u := new(models.OrderCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateOrderBadRequest()
	}

	// get user id from jwt
	userJWT := c.Get("user").(*jwt.Token)
	claims := userJWT.Claims.(*models.JWTClaims)
	u.CreatedBy = claims.User

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateOrderBadRequest()
	}

	// create
	order, err := m.OrderRepository.CreateOrder(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, order)
}
