package controllers

import (
	"bytes"
	"errors"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
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

	t.Run("Fail to create image", func(t *testing.T) {
		var body = new(bytes.Buffer)
		writer := multipart.NewWriter(body)
		fileWriter, err := writer.CreateFormFile("files", "test.png")
		assert.NoError(t, err)
		fileWriter.Write([]byte("file content"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		imageMock := new(mocks.ImageMock)
		imageMock.On("CreateImage", mock.Anything).Return("", errors.New("error"))
		imageController := ImageController{ImageRepository: imageMock}

		// test
		err = imageController.CreateImage(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create image successfully", func(t *testing.T) {
		var body = new(bytes.Buffer)
		writer := multipart.NewWriter(body)
		fileWriter, err := writer.CreateFormFile("files", "test.png")
		assert.NoError(t, err)
		fileWriter.Write([]byte("file content"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		imageMock := new(mocks.ImageMock)
		imageMock.On("CreateImage", mock.Anything).Return("id", nil)
		imageController := ImageController{ImageRepository: imageMock}

		// test
		err = imageController.CreateImage(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}
