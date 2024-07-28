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

// Get the orders
// @Summary      Get orders from db
// @Description  Get all the orders, limit for query o default limit
// @Tags         Orders
// @Produce      json
// @Success      200 {array} models.Order
// @Failure      400
// @Failure      500
// @Router       /orders [get]
func (m *OrderController) ReadOrders(c echo.Context) error {
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.OrdersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.OrdersBadRequest()
	}

	// get orders
	orders, err := m.OrderRepository.SelectOrders(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, orders)
}

// Get aggregate from orders
// @Summary      Get aggregate from orders
// @Description  Get result of aggregate function from orders
// @Tags         Orders
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /orders/aggregate [get]
func (m *OrderController) AggregateOrders(c echo.Context) error {
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateOrdersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.AggregateOrdersBadRequest()
	}

	// get aggregate
	aggregate, err := m.OrderRepository.AggregationOrders(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, aggregate)
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
