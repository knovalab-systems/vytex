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

func TestReadSuppliers(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get suppliers", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("SelectSuppliers").Return(defaultError)

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.ReadSuppliers(c)
		assert.Error(t, err)

	})

	t.Run("Get suppliers succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("SelectSuppliers").Return(nil)

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.ReadSuppliers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateSupplier(t *testing.T) {
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
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("AggregationSuppliers", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.AggregateSuppliers(c)
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
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("AggregationSuppliers", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.AggregateSuppliers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
