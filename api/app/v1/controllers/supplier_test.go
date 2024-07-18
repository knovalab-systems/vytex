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

func TestCreateSupplier(t *testing.T) {

	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": 32321, "code": 3232, "nit": "fsdfdsfsa"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}
		// test
		err := supplierController.CreateSupplier(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate nit no len=10", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": "proveedor", "code": "3232", "nit": "1123232323"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}
		// test
		err := supplierController.CreateSupplier(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	missingFieldsTestCases := []models.SupplierCreateBody{{
		Name: "tela",
		Code: "1",
	}, {
		Name: "tela",
		Nit:  "1111111111",
	}, {
		Name: "tela",
		Nit:  "1111111111",
	}}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]

		t.Run("Fail validate, missing field or zero value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{"name": testCase.Name, "code": testCase.Code,
				"nit": testCase.Nit})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			supplierMock := mocks.SupplierMock{}

			// controller
			supplierController := SupplierController{SupplierRepository: &supplierMock}
			// test
			err := supplierController.CreateSupplier(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})

	}

	t.Run("Fail create, supplier code or nit exists", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		nit := "111111111"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "nit": nit})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("CreateSupplier", &models.SupplierCreateBody{Name: name, Code: code, Nit: nit}).Return(&models.Supplier{}, problems.SupplierCodeExists())
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.CreateSupplier(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})
	t.Run("Create supplier successfully", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		nit := "111111111"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "nit": nit})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("CreateSupplier", &models.SupplierCreateBody{Name: name, Code: code, Nit: nit}).Return(&models.Supplier{}, nil)
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.CreateSupplier(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}
