package controllers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

type UserController struct {
	repository.UserRepository
}

func (m *UserController) ReadUsers(c echo.Context) error {
	// for query params
	u := &models.Request{Limit: -1}

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AuthBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.AuthBadRequest()
	}

	// sanitize
	if err := utils.SanitizedQuery(u); err != nil {
		return problems.AuthBadRequest()
	}

	// do query
	users, err := m.SelectUsers(u)
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)
}

func (m *UserController) AggregateUsers(c echo.Context) error {
	// for query params
	u := new(models.AggregateRequest)

	// bind
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(400)
	}

	// validate
	if err := c.Validate(u); err != nil {
		return echo.NewHTTPError(400)
	}

	// do query
	aggregate, err := m.UserRepository.AggregationUsers(u)
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: aggregate}
	return c.JSON(200, res)
}
