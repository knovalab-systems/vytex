package controllers

import (
	"log"
	"reflect"
	"strconv"

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

	log.Print("model", u)

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

	// get name
	s := c.QueryParam("name")

	// do query
	users, err := m.SelectUserByName(u, s)

	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}

	return c.JSON(200, res)
}

func (m *UserController) ReadUsersByUsername(c echo.Context) error {
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

	// get username
	s := c.QueryParam("username")

	// do query
	users, err := m.SelectUserByUsername(u, s)
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)
}

func (m *UserController) ReadDisabledUsers(c echo.Context) error {
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
	users, err := m.SelectDisabledUsers(u)
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)

}

func (m *UserController) ReadEnabledUsers(c echo.Context) error {
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
	users, err := m.SelectEnabledUsers(u)
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)
}

func (m *UserController) ReadUsersBuRole(c echo.Context) error {
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

	// get role
	s := c.QueryParam("role")

	// convert role to int8
	r, err := strconv.ParseInt(s, 10, 8)

	//ParseInt(s string, base int, bitSize int)
	if err != nil {
		return problems.UsersBadRequest()
	}

	// do query
	users, err := m.SelectUsersByRole(u, int8(r))
	if err != nil {
		return problems.ServerError()
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)
}
