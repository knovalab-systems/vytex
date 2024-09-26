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

// Get aggregate from roles
// @Summary      Get aggregate from roles
// @Description  Get result of aggregate function from roles
// @Tags         Roles
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /roles/aggregate [get]
func (m *RoleController) AggregateRoles(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateRolesBadRequest()
	}

	// aggegation
	aggregate, err := m.RoleRepository.AggregationRoles(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}

// Create role
// @Summary      Create role
// @Description  Create a new role
// @Tags         Roles
// @Produce      json
// @Param		 models.RoleCreateBody body string true "Role create values"
// @Success      201 {object} models.Role
// @Failure      400
// @Failure      409
// @Failure      500
// @Router       /roles [post]
func (m *RoleController) CreateRole(c echo.Context) error {
	u := new(models.RoleCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ServerError()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateRoleBadRequest()
	}

	// create role
	role, err := m.RoleRepository.CreateRole(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, role)
}
