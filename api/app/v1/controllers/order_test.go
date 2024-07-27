package controllers

import (
	"bytes"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateOrder(t *testing.T) {
	t.Run("Fail binding, color_by_reference_id", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"custom_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		orderMock := mocks.OrderMock{}

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.CreateOrder(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Fail binding, custom_id", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"color_by_reference_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		orderMock := mocks.OrderMock{}

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.CreateOrder(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	missingFieldsTestCases := []models.OrderCreateBody{
		{CustomID: 1},
		{ColorByReferenceID: 1},
	}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]

		t.Run("Fail create order, missing fields", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]any{"custom_id": testCase.CustomID, "color_by_reference_id": testCase.ColorByReferenceID})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

			// mocks
			orderMock := mocks.OrderMock{}

			// controller
			orderController := OrderController{OrderRepository: &orderMock}

			// test
			err := orderController.CreateOrder(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})
	}

	t.Run("Fail create order", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"custom_id": 1, "color_by_reference_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("CreateOrder").Return(problems.ServerError())

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.CreateOrder(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create order successfully", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"custom_id": 1, "color_by_reference_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("CreateOrder").Return(nil)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.CreateOrder(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})
}
