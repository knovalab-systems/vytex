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

// Get the users
// @Summary      Get users from db
// @Description  Get all the user, limit for query o default limit
// @Tags         Users
// @Produce      json
// @Success      200 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users [get]
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
	return c.JSON(200, users)
}

// Get aggregate from users
// @Summary      Get aggregate from users
// @Description  Get an aggregate function from users resource
// @Tags         Users
// @Produce      json
// @Success      200 {object} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /users/aggregate [get]
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
	return c.JSON(200, aggregate)
}

// Update role
// @Summary      Update role
// @Description  Updates the role of a user
// @Tags         Users
// @param		 userId path string true "User ID"
// @Produce      json
// @Success      200 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users/{userId} [post]
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

	return c.JSON(200, user)
}
