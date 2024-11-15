package controllers

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ResourceController struct {
	repository.ResourceRepository
}

// ReadResource Get a resource
// @Summary      Get a resource
// @Description  Get a resource by id
// @Tags         Resources
// @Produce      json
// @Param        id path string true "Resource ID"
// @Success      200 {object} models.Resource
// @Failure      400
// @Failure      500
// @Router       /resources/{id} [get]
func (m *ResourceController) ReadResource(c echo.Context) error {
	u := new(models.ResourceRead)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ResourcesBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.ResourcesBadRequest()
	}

	// get resource
	resource, err := m.ResourceRepository.SelectResource(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, resource)
}

// Get the resources
// @Summary      Get resources from db
// @Description  Get all the resources, limit for query o default limit
// @Tags         Resources
// @Produce      json
// @Success      200 {array} models.Resource
// @Failure      400
// @Failure      500
// @Router       /resources [get]
func (m *ResourceController) ReadResources(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ResourcesBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.ResourcesBadRequest()
	}

	// get resources
	resources, err := m.ResourceRepository.SelectResources(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, resources)

}

// Get aggregate from resources
// @Summary      Get aggregate from resources
// @Description  Get result of aggregate function from resources
// @Tags         Resources
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /resources/aggregate [get]
func (m *ResourceController) AggregateResources(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateUsersBadRequest()
	}

	// aggegation
	aggregate, err := m.ResourceRepository.AggregationResources(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)
}

// CreateResource Create a resource
// @Summary      Create a resource
// @Description  Create a new resource
// @Tags         Resources
// @Produce      json
// @Param        resource body models.ResourceCreateBody true "Resource create values"
// @Success      201 {object} models.Resource
// @Failure      400
// @Failure      409
// @Failure      500
// @Router       /resources [post]
func (m *ResourceController) CreateResource(c echo.Context) error {
	u := new(models.ResourceCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateResourceBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateResourceBadRequest()
	}

	// create
	resource, err := m.ResourceRepository.CreateResource(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, resource)
}

// UpdateResource Update a resource
// @Summary      Update a resource
// @Description  Update a resource by id
// @Tags         Resources
// @Param        resourceId path string true "Resource ID"
// @Param        models.ResourceUpdateBody body string true "Resource update values"
// @Produce      json
// @Success      200 {object} models.Resource
// @Failure      400
// @Failure      500
// @Router       /resources/{resourceId} [patch]
func (m *ResourceController) UpdateResource(c echo.Context) error {
	u := new(models.ResourceUpdateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateResourceBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateResourceBadRequest()
	}

	// update
	resource, err := m.ResourceRepository.UpdateResource(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, resource)
}
