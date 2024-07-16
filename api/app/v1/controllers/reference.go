package controllers

import (
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ReferenceController struct {
	repository.ReferenceRepository
}

// CreateReference Create reference
// @Summary      Create reference
// @Description  Create a new reference
// @Tags         References
// @Produce      json
// @Param		 models.ReferenceCreateBody body string true "Reference create values"
// @Success      201 {object} models.Reference
// @Failure      400
// @Failure      409
// @Failure      500
// @Router       /reference [post]
func (m *ReferenceController) CreateReference(c echo.Context) error {
	u := new(models.ReferenceCreateBody)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.CreateReferenceBadRequest()
	}

	// get user id from jwt
	userJWT := c.Get("user").(*jwt.Token)
	claims := userJWT.Claims.(*models.JWTClaims)
	u.CreatedBy = claims.User

	// validate
	if err := c.Validate(u); err != nil {
		return problems.CreateReferenceBadRequest()
	}

	// create
	reference, err := m.ReferenceRepository.CreateReference(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, reference)
}
