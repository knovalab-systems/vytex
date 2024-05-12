package controllers

import (
	"reflect"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type UserController struct {
	repository.UserRepository
}

func (m *UserController) ReadUsers(c echo.Context) error {
	// for query params
	u := new(models.Query)

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
		return err
	}

	// return data
	res := models.Response{Data: users}
	return c.JSON(200, res)
}

func (m *UserController) AggregateUsers(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateUsersBadRequest()
	}

	// validate
	if reflect.ValueOf(u).Elem().IsZero() {
		return problems.AggregateUsersBadRequest()
	}

	// aggegation
	aggregate, err := m.UserRepository.AggregationUsers(u)
	if err != nil {
		return err
	}

	// return data
	res := models.Response{Data: aggregate}
	return c.JSON(200, res)
}

func (m *UserController) UpdateUser(c echo.Context) error {
	u := new(models.UpdateUserBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateUsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateUsersBadRequest()
	}

	// update
	user, err := m.UserRepository.UpdateUser(u)
	if err != nil {
		return err
	}

	return c.JSON(200, models.Response{
		Data: user,
	})
}
