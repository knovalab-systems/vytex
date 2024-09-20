package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type RoleController struct {
	repository.RoleRepository
}

// Get the roles
// @Summary      Get roles from db
// @Description  Get all the roles, limit for query o default limit
// @Tags         Roles
// @Produce      json
// @Success      200 {array} models.Role
// @Failure      400
// @Failure      500
// @Router       /roles [get]
func (m *RoleController) ReadRoles(c echo.Context) error {
	// for query params
	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.RoleBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.RoleBadRequest()
	}

	// get roles
	roles, err := m.RoleRepository.SelectRoles(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, roles)
}
