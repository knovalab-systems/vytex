package controllers

import (
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
)

type ImageController struct {
	repository.ImageRepository
}

// CreateImage Create file
// @Summary      Create file
// @Description  Create a new file
// @Tags         Files
// @Produce      json
// @Param		 models.FileCreateBody body string true "File create values"
// @Success      201 {object} models.File
// @Failure      400
// @Failure      500
// @Router       /files [post]
func (m *ImageController) CreateImage(c echo.Context) error {

	// get file
	file, err := c.FormFile("file")

	// create file
	dst, err := m.ImageRepository.CreateImage(file)

	if err != nil {
		return problems.FilesBadRequest()
	}

	return c.JSON(201, dst)
}
