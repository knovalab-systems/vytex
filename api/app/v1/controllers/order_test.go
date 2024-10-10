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

func TestReadOrders(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail select orders", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("SelectOrders").Return(defaultError)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.ReadOrders(c)
		assert.Error(t, err)

	})

	t.Run("Select orders successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("SelectOrders").Return(nil)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.ReadOrders(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestReadOrder(t *testing.T) {

	t.Run("Fail binding, id is no find", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		err := orderController.ReadOrder(c)
		assert.Error(t, err)
	})

	t.Run("Not found order", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("orderId")
		c.SetParamValues("1")

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("SelectOrder").Return(errors.New("Error"))
		orderController := OrderController{OrderRepository: &orderMock}

		err := orderController.ReadOrder(c)
		assert.Error(t, err)
	})

	t.Run("Get order successfully", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("orderId")
		c.SetParamValues("1")

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("SelectOrder").Return(nil, nil)
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.ReadOrder(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestAggregateOrder(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail aggregate orders", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("AggregationOrders", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.AggregateOrders(c)
		assert.Error(t, err)

	})

	t.Run("Aggregate orders successfully", func(t *testing.T) {
		//
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("AggregationOrders", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.AggregateOrders(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

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

func TestUpdateOrder(t *testing.T) {

	t.Run("Fail binding, id is missing", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderMock := mocks.OrderMock{}

		// controller
		orderController := OrderController{OrderRepository: &orderMock}
		// test
		err := orderController.UpdateOrder(c)
		// test
		assert.Error(t, err)
	})

	t.Run("Update order with status", func(t *testing.T) {
		// context
		id := "1"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"order_state_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("orderId")
		c.SetParamValues(id)

		// mocks
		orderMock := mocks.OrderMock{}
		orderMock.On("UpdateOrder").Return(&models.Order{}, nil)

		// controller
		orderController := OrderController{OrderRepository: &orderMock}

		// test
		err := orderController.UpdateOrder(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
