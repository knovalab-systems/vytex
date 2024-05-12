package controllers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
	"reflect"
)

type UserController struct {
	repository.UserRepository
}

func (m *UserController) ReadUsers(c echo.Context) error {
	// for query params
	u := new(models.Request)

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

	// get filter structure
	filters, e := m.UserRepository.GetUserFilter(u)

	if e != nil {
		return problems.ServerError()
	}

	// do query
	var users []*models.User
	var err error

	// Check if UserFilter fields are not empty and add queries accordingly
	if filters.Username != "" || filters.Name != "" || filters.Role != "" || filters.DeleteAt != "" {
		users, err = m.UserRepository.SelectUsersByFilter(&filters, u)
	} else {
		users, err = m.SelectUsers(u)
	}

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
