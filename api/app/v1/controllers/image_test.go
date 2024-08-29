package controllers

import (
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCreateImage(t *testing.T) {

	t.Run("Fail to get multipart form", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		imageMock := mocks.ImageMock{}
		imageController := ImageController{ImageRepository: &imageMock}

		// test
		err := imageController.CreateImage(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("No files in multipart form", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(""))
		req.Header.Set(echo.HeaderContentType, echo.MIMEMultipartForm)
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		imageMock := mocks.ImageMock{}
		imageController := ImageController{ImageRepository: &imageMock}

		// test
		err := imageController.CreateImage(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail to validate extension", func(t *testing.T) {
		// context
		body := new(strings.Builder)
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("files", "test.txt")
		part.Write([]byte("dummy content"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body.String()))
		req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		imageMock := new(mocks.ImageMock)
		imageMock.On("CreateImage", mock.Anything).Return([]*models.Image{}, problems.ImagesBadRequest())

		imageController := ImageController{ImageRepository: imageMock}

		err := imageController.CreateImage(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail to create image", func(t *testing.T) {
		// context
		body := new(strings.Builder)
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("files", "test.jpg")
		part.Write([]byte("dummy content"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body.String()))
		req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		imageMock := new(mocks.ImageMock)
		imageMock.On("CreateImage", mock.Anything).Return([]*models.Image{}, problems.ServerError())

		imageController := ImageController{ImageRepository: imageMock}

		err := imageController.CreateImage(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create image successfully", func(t *testing.T) {
		// context
		body := new(strings.Builder)
		writer := multipart.NewWriter(body)
		part, _ := writer.CreateFormFile("files", "test.jpg")
		part.Write([]byte("dummy content"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body.String()))
		req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		imageMock := new(mocks.ImageMock)
		imageMock.On("CreateImage", mock.Anything).Return([]*models.Image{}, nil)

		imageController := ImageController{ImageRepository: imageMock}

		if assert.NoError(t, imageController.CreateImage(c)) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})
}
