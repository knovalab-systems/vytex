package controllers

import (
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"strings"
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

	// temp validation
	if c.Request().Header.Get("Content-Type") != "" && !strings.HasPrefix(c.Request().Header.Get("Content-Type"), "multipart/form-data") {
		log.Println("request Content-Type isn't multipart/form-data")
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Content-Type must be multipart/form-data"})
	}

	// get file
	form, err := c.MultipartForm()

	if err != nil {
		log.Print("error")
		log.Print(err)
		return problems.FilesBadRequest()
	}

	files := form.File["files"]

	if len(files) == 0 {
		return problems.FilesBadRequest()
	}

	var dstPaths []string
	for _, file := range files {
		var dst string
		{
			dst, err = m.ImageRepository.CreateImage(file)
			if err != nil {
				return problems.FilesBadRequest()
			}
			dstPaths = append(dstPaths, dst)
		}
	}

	return c.JSON(201, dstPaths)
}
