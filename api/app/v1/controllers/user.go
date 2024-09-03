package controllers

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
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
// @Description  Get all the users, limit for query o default limit
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
	users, err := m.UserRepository.SelectUsers(u)
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
// @Router       /users/{userId} [get]
func (m *UserController) ReadUser(c echo.Context) error {
	// for query params
	u := new(models.UserRead)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get user
	user, err := m.UserRepository.SelectUser(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, user)
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
	u := new(models.UserRead)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get user id from jwt
	userJWT := c.Get("user").(*jwt.Token)
	claims := userJWT.Claims.(*models.JWTClaims)
	u.ID = claims.User

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get user
	user, err := m.UserRepository.SelectUser(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, user)
}

// Get aggregate from users
// @Summary      Get aggregate from users
// @Description  Get result of aggregate function from users
// @Tags         Users
// @Produce      json
// @Success      200 {array} models.AggregateData
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

	// aggegation
	aggregate, err := m.UserRepository.AggregationUsers(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}

// Update user
// @Summary      Update use
// @Description  Updates the fields from user
// @Tags         Users
// @Param		 userId path string true "User ID"
// @Param		 models.UpdateUserBody body string true "User update values"
// @Produce      json
// @Success      200 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users/{userId} [post]
func (m *UserController) UpdateUser(c echo.Context) error {
	u := new(models.UserUpdateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateUserBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateUserBadRequest()
	}

	// update
	user, err := m.UserRepository.UpdateUser(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}

// Create user
// @Summary      Create user
// @Description  Create a new user
// @Tags         Users
// @Produce      json
// @Param		 models.UserCreateBody body string true "User create values"
// @Success      201 {object} models.User
// @Failure      400
// @Failure      500
// @Router       /users [post]
func (m *UserController) CreateUser(c echo.Context) error {
	u := new(models.UserCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateUserBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateUserBadRequest()
	}

	// create
	user, err := m.UserRepository.CreateUser(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, user)
}
