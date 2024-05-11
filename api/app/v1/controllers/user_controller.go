package controllers

import (
	"reflect"

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
		return problems.UsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// sanitize
	if err := utils.SanitizedQuery(u); err != nil {
		return problems.UsersBadRequest()
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
		return problems.AggregateUsersBadRequest()
	}

	// validate
	if reflect.ValueOf(u).Elem().IsZero() {
		return problems.AggregateUsersBadRequest()
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

func (m *UserController) ReadUsersByName(c echo.Context) error {
	name := c.QueryParam("name")

	users, err := m.SelectUserByName(name)

	if err != nil {
		return echo.NewHTTPError(404, err.Error())
	}
	if len(users) == 0 {
		return echo.NewHTTPError(404, "User not found")
	}

	return c.JSON(200, users)
}

func (m *UserController) ReadUsersByUsername(c echo.Context) error {
	username := c.QueryParam("username")

	user, err := m.SelectUserByUsername(username)

	if err != nil {
		return echo.NewHTTPError(404, err.Error())
	}
	if user == nil {
		return echo.NewHTTPError(404, "User not found")
	}

	return c.JSON(200, user)
}
