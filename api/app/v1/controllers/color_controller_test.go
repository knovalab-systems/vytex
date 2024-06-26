package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
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
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColors(c)
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
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColors(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateColor(t *testing.T) {

	// dont fail binding on any case

	t.Run("Fail validation empty fields", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.AggregateColors(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Get aggregate succesfully", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("AggregationColors", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.AggregateColors(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
