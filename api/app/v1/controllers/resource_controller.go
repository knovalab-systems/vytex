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

// Get the resources
// @Summary      Get resources from db
// @Description  Get all the resources, limit for query o default limit
// @Tags         resources
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
	resources, err := m.SelectResources(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, resources)

}
