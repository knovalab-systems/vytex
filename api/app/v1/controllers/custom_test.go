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
