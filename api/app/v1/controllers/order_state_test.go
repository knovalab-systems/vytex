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

func TestReadOrderStatus(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail select order status", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderStateMock := mocks.OrderStateMock{}
		orderStateMock.On("SelectOrderStatus").Return(defaultError)

		// controller
		orderController := OrderStateController{OrderStateRepository: &orderStateMock}

		// test
		err := orderController.ReadOrderStatus(c)
		assert.Error(t, err)

	})

	t.Run("Select order status successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		orderStateMock := mocks.OrderStateMock{}
		orderStateMock.On("SelectOrderStatus").Return(nil)

		// controller
		orderController := OrderStateController{OrderStateRepository: &orderStateMock}

		// test
		err := orderController.ReadOrderStatus(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
