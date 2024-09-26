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

// Get role
// @Summary      Get role from db
// @Description  Get role by id
// @Tags         Roles
// @Produce      json
// @Param        roleId path string true "Role ID"
// @Success      200 {object} models.Role
// @Failure      400
// @Failure      403
// @Failure      500
// @Router       /roles/{roleId} [get]
func (m *RoleController) ReadRole(c echo.Context) error {
	u := new(models.RoleRead)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.RoleBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.RoleBadRequest()
	}

	// get role
	role, err := m.RoleRepository.SelectRole(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, role)
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

// Update role
// @Summary      Update role
// @Description  Updates the fields from role
// @Tags         Role
// @Param		 roleId path string true "Role ID"
// @Param		 models.RoleUpdateBody body string true "Role update values"
// @Produce      json
// @Success      200 {object} models.Role
// @Failure      400
// @Failure      403
// @Failure      500
// @Router       /roles/{roleId} [PATCH]
func (m *RoleController) UpdateRole(c echo.Context) error {
	u := new(models.RoleUpdateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateRoleBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateRoleBadRequest()
	}

	// update role
	role, err := m.RoleRepository.UpdateRole(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, role)
}
