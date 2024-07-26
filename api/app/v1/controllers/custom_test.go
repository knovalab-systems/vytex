package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadCustoms(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get customs", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		customMock := mocks.CustomMock{}
		customMock.On("SelectCustoms").Return(defaultError)

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.ReadCustoms(c)
		assert.Error(t, err)

	})

	t.Run("Get customs succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		customMock := mocks.CustomMock{}
		customMock.On("SelectCustoms").Return(nil)

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.ReadCustoms(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateCustom(t *testing.T) {
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
		customMock := mocks.CustomMock{}
		customMock.On("AggregationCustoms", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.AggregateCustoms(c)
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
		customMock := mocks.CustomMock{}
		customMock.On("AggregationCustoms", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.AggregateCustoms(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestCreateCustom(t *testing.T) {
	t.Run("Fail binding, orders", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"orders": 123, "client": "32432"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		customMock := mocks.CustomMock{}

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.CreateCustom(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail binding, color_by_reference_id", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"orders": []map[string]any{{"color_by_reference_id": "texto"}}, "client": "32432"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		customMock := mocks.CustomMock{}

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.CreateCustom(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail binding, client", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"orders": []map[string]any{{"color_by_reference_id": 1}}, "client": nil})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		customMock := mocks.CustomMock{}

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.CreateCustom(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	missingFieldsTestCases := []models.CustomCreateBody{{
		Client: "supplier",
	}, {Orders: []models.CustomOrderCreateBody{{ColorByReferenceID: 1}}}}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]
		t.Run("Create custom succesfully", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]any{"orders": testCase.Orders, "client": testCase.Client})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

			// mocks
			customMock := mocks.CustomMock{}

			// controller
			customController := CustomController{CustomRepository: &customMock}

			// test
			err := customController.CreateCustom(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})
	}

	t.Run("Fail create custom", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"orders": []map[string]any{{"color_by_reference_id": 1}}, "client": "texto"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		customMock := mocks.CustomMock{}
		customMock.On("CreateCustom").Return(problems.ServerError())

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.CreateCustom(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create custom succesfully", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"orders": []map[string]any{{"color_by_reference_id": 1}}, "client": "texto"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		customMock := mocks.CustomMock{}
		customMock.On("CreateCustom").Return(nil)

		// controller
		customController := CustomController{CustomRepository: &customMock}

		// test
		err := customController.CreateCustom(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})
}
