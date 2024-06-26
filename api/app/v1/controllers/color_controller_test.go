package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadColors(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get colors", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColors").Return(defaultError)

		// controller
		userController := ColorController{ColorRepository: &colorMock}

		// test
		err := userController.ReadColors(c)
		assert.Error(t, err)

	})

	t.Run("Get colors succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColors").Return(nil)

		// controller
		userController := ColorController{ColorRepository: &colorMock}

		// test
		err := userController.ReadColors(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}
