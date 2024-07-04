package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
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
	defaultError := errors.New("ERROR")

	// dont fail binding on any case

	t.Run("fail on get aggregate", func(t *testing.T) {
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
		colorMock.On("AggregationColors", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.AggregateColors(c)
		assert.Error(t, err)
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

func TestCreateColor(t *testing.T) {

	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]int{"name": 32321, "code": 3232, "hex": 3232})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, wrong hexcolor format", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": "Blanco", "code": "1", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, missing name", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"code": "1", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, missing code", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": "Blanco", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail create, color code exists", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("CreateColor", &models.ColorCreateBody{Name: name, Code: code, Hex: hex}).Return(&models.Color{}, problems.CodeColorExists())
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})
	t.Run("Create color successfully", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("CreateColor", &models.ColorCreateBody{Name: name, Code: code, Hex: hex}).Return(&models.Color{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.CreateColor(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}
