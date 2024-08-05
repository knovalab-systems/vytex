package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestSelectSuppliers(t *testing.T) {
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

func TestSelectSupplier(t *testing.T) {

	t.Run("Fail binding, id is no find", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}

		// controller
		controller := SupplierController{SupplierRepository: &supplierMock}

		err := controller.ReadSupplier(c)
		assert.Error(t, err)
	})

	t.Run("Not found supplier", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("supplierId")
		c.SetParamValues("1")

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("SelectSupplier").Return(errors.New("Error"))
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		err := supplierController.ReadSupplier(c)
		assert.Error(t, err)
	})

	t.Run("Get supplier successfully", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("supplierId")
		c.SetParamValues("1")

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("SelectSupplier").Return(nil, nil)
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.ReadSupplier(c)
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
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": 32321, "code": 3232, "nit": "fsdfdsfsa"})
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
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": "supplier", "code": "3232", "nit": "1123232323"})
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
		Name:  "supplier",
		Code:  "1",
		Brand: "brand",
	}, {
		Name:  "supplier",
		Nit:   "1111111111",
		Brand: "brand",
	}, {
		Code:  "1",
		Brand: "brand",
		Nit:   "1111111111",
	}, {
		Name: "supplier",
		Code: "1",
		Nit:  "1111111111",
	}}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]

		t.Run("Fail validate, missing field or zero value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": testCase.Name, "code": testCase.Code,
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
		brand := "brand"
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "nit": nit, "brand": brand})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("CreateSupplier", &models.SupplierCreateBody{Name: name, Code: code, Nit: nit, Brand: brand}).Return(&models.Supplier{}, problems.SupplierCodeExists())
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
		brand := "brand"
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "nit": nit, "brand": brand})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("CreateSupplier", &models.SupplierCreateBody{Name: name, Code: code, Nit: nit, Brand: brand}).Return(&models.Supplier{}, nil)
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.CreateSupplier(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}

func TestUpdateSupplier(t *testing.T) {

	t.Run("Fail binding, id is missing", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": 32321, "code": 3232, "nit": "fsdfdsfsa"})
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
		err := supplierController.UpdateSupplier(c)
		// test
		assert.Error(t, err)
	})

	t.Run("Fail validate nit no len=10", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": "supplier", "code": "3232", "nit": "1123232323"})
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
		err := supplierController.UpdateSupplier(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, supplier code exits", func(t *testing.T) {
		// context
		code := "1"
		id := "1"
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"code": code})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("supplierId")
		c.SetParamValues(id)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("UpdateSupplier").Return(&models.Supplier{}, errors.New("error"))

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.CreateSupplier(c)
		assert.Error(t, err)
	})

	t.Run("Fail update, supplier nit exits", func(t *testing.T) {
		// context
		nit := "111111111"
		id := "1"
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"nit": nit})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("supplierId")
		c.SetParamValues(id)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("UpdateSupplier").Return(&models.Supplier{}, errors.New("error"))

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.CreateSupplier(c)
		assert.Error(t, err)
	})

	testCasesOneValue := map[string]interface{}{
		"name":       "Supplier",
		"code":       "1",
		"nit":        "111111111",
		"brand":      "brand",
		"deleted_at": "2021-09-01T00:00:00Z",
	}

	for key, value := range testCasesOneValue {
		t.Run("Update supplier successfully on some values", func(t *testing.T) {
			// context
			id := "1"
			body := new(bytes.Buffer)
			_ = json.NewEncoder(body).Encode(map[string]interface{}{key: value})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.SetParamNames("supplierId")
			c.SetParamValues(id)

			// mocks
			supplierMock := mocks.SupplierMock{}
			supplierMock.On("UpdateSupplier").Return(&models.Supplier{}, nil)

			// controller
			supplierController := SupplierController{SupplierRepository: &supplierMock}

			// test
			err := supplierController.UpdateSupplier(c)
			if assert.NoError(t, err) {
				assert.Equal(t, http.StatusOK, rec.Code)
			}
		})
	}

	t.Run("Update supplier successfully with all fields", func(t *testing.T) {
		// context
		id := "1"
		name := "Supplier"
		code := "1"
		nit := "111111111"
		brand := "brand"
		deleted_at := "2021-09-01T00:00:00Z"

		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code,
			"nit": nit, "brand": brand, "deleted_at": deleted_at})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("supplierId")
		c.SetParamValues(id)

		// mocks
		supplierMock := mocks.SupplierMock{}
		supplierMock.On("UpdateSupplier").Return(&models.Supplier{}, nil)

		// controller
		supplierController := SupplierController{SupplierRepository: &supplierMock}

		// test
		err := supplierController.UpdateSupplier(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}
