package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ColorController struct {
	repository.ColorRepository
}

func (m *ColorController) ReadColors(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	// get colors
	colors, err := m.SelectColors(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, colors)

}
