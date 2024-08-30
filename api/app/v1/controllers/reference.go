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

// Get the references
// @Summary      Get references from db
// @Description  Get all the references, limit for query o default limit
// @Tags         References
// @Produce      json
// @Success      200 {array} models.Reference
// @Failure      400
// @Failure      500
// @Router       /references [get]
func (m *ReferenceController) ReadReferences(c echo.Context) error {

	u := new(models.Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ReferencesBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.ReferencesBadRequest()
	}

	// get references
	references, err := m.ReferenceRepository.SelectReferences(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, references)
}

// Get aggregate from references
// @Summary      Get aggregate from references
// @Description  Get result of aggregate function from references
// @Tags         References
// @Produce      json
// @Success      200 {array} models.AggregateData
// @Failure      400
// @Failure      500
// @Router       /references/aggregate [get]

func (m *ReferenceController) AggregateReferences(c echo.Context) error {
	// for query params
	u := new(models.AggregateQuery)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.AggregateReferencesBadRequest()
	}

	// get aggregate
	aggregate, err := m.ReferenceRepository.AggregationReferences(u)
	if err != nil {
		return err
	}

	// return data
	return c.JSON(http.StatusOK, aggregate)

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

// UpdateTimesReference Update the times of reference
// @Summary      Update times of reference
// @Description  Update times of reference by id
// @Tags         References
// @Param        referenceId path string true "Reference ID"
// @Param        models.TimeByTaskReferenceUpdate body string true "Times update values"
// @Produce      json
// @Success      200 {object} models.Reference
// @Failure      400
// @Failure      500
// @Router       /references/times-by-task/{referenceId} [patch]
func (m *ReferenceController) UpdateTimesReference(c echo.Context) error {
	u := new(models.TimeByTaskReferenceUpdate)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UpdateTimeReferenceBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UpdateTimeReferenceBadRequest()
	}

	// update
	reference, err := m.ReferenceRepository.UpdateTimesReference(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, reference)
}

// ReadReference Get a reference
// @Summary      Get a reference
// @Description  Get a reference by id
// @Tags         References
// @Produce      json
// @Param        refenceId path string true "References ID"
// @Success      200 {object} models.Reference
// @Failure      400
// @Failure      500
// @Router       /references/{refenceId} [get]
func (m *ReferenceController) ReadReference(c echo.Context) error {
	u := new(models.ReferenceRead)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.ReferencesBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.ReferencesBadRequest()
	}

	// get reference
	reference, err := m.ReferenceRepository.SelectReference(u)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, reference)
}
