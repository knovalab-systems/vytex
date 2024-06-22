package controllers

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ReferenceController struct {
	repository.ReferenceRepository
}

func (m *ReferenceController) CreateReference(c echo.Context) error {
	u := new(models.ReferenceCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateReferenceBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateReferenceBadRequest()
	}

	return nil

}
