package controllers

import (
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ImageController struct {
	repository.ImageRepository
}

// CreateImage Create image
// @Summary      Create image
// @Description  Create a new image
// @Tags         Files
// @Produce      json
// @Success      201 {array} models.Image
// @Failure      400
// @Failure      500
// @Router       /images [post]
func (m *ImageController) CreateImage(c echo.Context) error {
	// get images
	form, err := c.MultipartForm()

	if err != nil {
		return problems.ImagesBadRequest()
	}

	files := form.File["files"]

	if len(files) == 0 {
		return problems.ImagesBadRequest()
	}

	images, err := m.ImageRepository.CreateImage(files)
	if err != nil {
		return err
	}

	return c.JSON(201, images)
}
