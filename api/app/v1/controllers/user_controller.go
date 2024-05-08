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
	u := new(models.Request)
	queryLimit := utils.QueryLimit()
	u.Limit = queryLimit

	// bind
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(400)
	}

	// validate
	if err := c.Validate(u); err != nil {
		return echo.NewHTTPError(400)
	}

	// set max value limite - PROPOSITION
	if u.Limit == -1 {
		u.Limit = queryLimit
	}

	// do pagination
	if u.Page > 0 {
		u.Offset = u.Limit * (u.Page - 1)
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
