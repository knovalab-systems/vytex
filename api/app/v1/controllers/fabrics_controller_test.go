package controllers

import (
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestFabricsColors(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get fabrics", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("SelectFabrics").Return(defaultError)

		// controller
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.ReadFabrics(c)
		assert.Error(t, err)

	})

	t.Run("Get fabrics succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("SelectFabrics").Return(nil)

		// controller
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.ReadFabrics(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateFabrics(t *testing.T) {
	t.Run("Fail validation empty fields", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("AggregationFabrics", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, errors.New("ERROR"))
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.AggregateFabrics(c)
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
		fabricMock := mocks.FabricMock{}
		fabricMock.On("AggregationFabrics", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.AggregateFabrics(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
