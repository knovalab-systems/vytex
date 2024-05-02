package controllers

import (
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type UserController struct {
	repository.UserRepository
}

func (m *UserController) ReadUsers(c echo.Context) error {

	// check role / permissions

	// get params

	// do query
	users, err := m.SelectUsers()
	if err != nil {
		return problems.ServerError()
	}

	// return data

	return c.JSON(200, users)
}
