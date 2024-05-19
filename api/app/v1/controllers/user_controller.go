package controllers

import (
	"log"
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
	return c.JSON(200, users)
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

	log.Println(u.ID)

	// validate
	if err := c.Validate(u); err != nil {
		log.Println("here")
		return problems.UsersBadRequest()
	}

	// get users
	users, err := m.SelectUser(u)
	if err != nil {
		log.Println("here")
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
// @param		 models.UpdateUserBody body string true "User update values"
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
