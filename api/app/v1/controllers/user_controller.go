package controllers

import (
	"net/http"
	"reflect"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/knovalab-systems/vytex/pkg/utils"
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
// @Success      200 {array} models.User
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

	// get users
	users, err := m.SelectUsers(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, users)
}

// Get an user
// @Summary      Get a given user
// @Description  Get an user by its ID
// @Tags         Users
// @Param		 userId path string true "User ID"
// @Produce      json
// @Success      200 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users/userId [get]
func (m *UserController) ReadUser(c echo.Context) error {
	// for query params
	u := new(models.ReadUser)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get users
	users, err := m.SelectUser(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, users)
}

// Get the current user
// @Summary      Get the curren user loggged
// @Description  Get the user who do the request with access token
// @Tags         Users
// @Produce      json
// @Success      200 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users/me [get]
func (m *UserController) ReadMe(c echo.Context) error {
	// for query params
	u := new(models.ReadUser)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*utils.JWTClaims)
	u.ID = claims.User

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get users
	users, err := m.SelectUser(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, users)
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
	return c.JSON(http.StatusOK, aggregate)
}

// Update role
// @Summary      Update role
// @Description  Updates the role of a user
// @Tags         Users
// @Param		 userId path string true "User ID"
// @Param		 models.UpdateUserBody body string true "User update values"
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

	return c.JSON(http.StatusOK, user)
}

// CreateUser Create user
// @Summary      Create user
// @Description  Create a new user
// @Tags         Users
// @Produce      json
// @Param		 models.CreateUserBody body string true "User create values"
// @Success      201 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users [post]
func (m *UserController) CreateUser(c echo.Context) error {
	u := new(models.CreateUserBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateUsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateUsersBadRequest()
	}

	// create
	user, err := m.UserRepository.CreateUser(u)

	if err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, user)
}
