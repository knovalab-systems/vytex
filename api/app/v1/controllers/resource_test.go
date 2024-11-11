package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/pkg/problems"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadResources(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get resources", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("SelectResources").Return(defaultError)

		// controller
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.ReadResources(c)
		assert.Error(t, err)

	})

	t.Run("Get resources succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("SelectResources").Return(nil)

		// controller
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.ReadResources(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestReadResource(t *testing.T) {
	t.Run("Fail binding, id is not find", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.ReadResource(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Not found resource", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("resourceId")
		c.SetParamValues("1")

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("SelectResource").Return(errors.New("error"))
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.ReadResource(c)
		assert.Error(t, err)
	})

	t.Run("Get resource successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("resourceId")
		c.SetParamValues("1")

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("SelectResource").Return(nil, nil)
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.ReadResource(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestAggregateResource(t *testing.T) {
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
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("AggregationResources", &models.AggregateQuery{Count: "*"}).Return(map[string]interface{}{}, defaultError)
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.AggregateResources(c)
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
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("AggregationResources", &models.AggregateQuery{Count: "*"}).Return(map[string]interface{}{}, nil)
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.AggregateResources(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestCreateResource(t *testing.T) {
	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": 32321, "code": 3232, "cost": "cost", "color_id": -1, "supplier_id": -1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}

		// controller
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.CreateResource(c)

		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	missingFieldsTestCases := []models.ResourceCreateBody{{
		Name:  "insumo",
		Cost:  12000.0,
		Code:  "1",
		Color: 1,
	}, {
		Name:     "insumo",
		Cost:     12000.0,
		Code:     "1",
		Supplier: 1,
	}, {
		Name:     "insumo",
		Cost:     12000.0,
		Color:    1,
		Supplier: 1,
	}, {
		Name:     "insumo",
		Code:     "1",
		Color:    1,
		Supplier: 1,
	}, {
		Cost:     12000.0,
		Code:     "1",
		Color:    1,
		Supplier: 1,
	}}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]

		t.Run("Fail validate, missing field or zero value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{"name": testCase.Name, "code": testCase.Code, "cost": testCase.Cost, "color_id": testCase.Color,
				"supplier_id": testCase.Supplier})
			req := httptest.NewRequest(http.MethodGet, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			resourceMock := mocks.ResourceMock{}

			// controller
			resourceController := ResourceController{ResourceRepository: &resourceMock}

			// test
			err := resourceController.CreateResource(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})

	}

	gtZeroTestCases := []models.ResourceCreateBody{{
		Cost:     12000.0,
		Color:    0,
		Supplier: 1,
	}, {
		Cost:     0.0,
		Color:    1,
		Supplier: 1,
	}, {
		Cost:     12000.0,
		Color:    1,
		Supplier: 0,
	}}

	for i := range gtZeroTestCases {
		testCase := gtZeroTestCases[i]

		t.Run("Fail validate, cost less than 0", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{"name": "Boton", "code": "1", "cost": testCase.Cost, "color_id": testCase.Color, "supplier_id": testCase.Supplier})
			req := httptest.NewRequest(http.MethodGet, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			resourceMock := mocks.ResourceMock{}
			resourceController := ResourceController{ResourceRepository: &resourceMock}

			// test
			err := resourceController.CreateResource(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})
	}

	t.Run("Fail create, resource code exists", func(t *testing.T) {
		// context
		name := "Boton"
		code := "1"
		cost := 23000.0
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "cost": cost, "supplier_id": 1, "color_id": 1})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("CreateResource", &models.ResourceCreateBody{Name: name, Code: code, Cost: cost, Color: 1,
			Supplier: 1}).Return(&models.Resource{}, problems.ResourceExists())
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.CreateResource(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create resource successfully", func(t *testing.T) {
		// context
		name := "Boton"
		code := "1"
		cost := 23000.0
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "cost": cost, "supplier_id": 1, "color_id": 1})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("CreateResource", &models.ResourceCreateBody{Name: name, Code: code, Cost: cost, Color: 1,
			Supplier: 1}).Return(&models.Resource{}, nil)
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.CreateResource(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}

func TestUpdateResource(t *testing.T) {
	t.Run("Fail binding, id is missing", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": 32321, "code": 3232, "cost": "cost", "color_id": 1, "supplier_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		resourceMock := mocks.ResourceMock{}

		// controller
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.UpdateResource(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, resource code exits", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"code": "1"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("resourceId")
		c.SetParamValues("1")

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("UpdateResource").Return(&models.Resource{}, errors.New("error"))
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.UpdateResource(c)
		assert.Error(t, err)
	})

	testCasesOneValue := map[string]interface{}{
		"name":        "Boton",
		"code":        "1",
		"cost":        23000.0,
		"color_id":    1,
		"supplier_id": 1,
		"deleted_at":  "2021-09-01T00:00:00Z",
	}

	for key, value := range testCasesOneValue {
		t.Run("Update resource successfully with some value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{key: value})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.SetParamNames("resourceId")
			c.SetParamValues("1")

			// mocks
			resourceMock := mocks.ResourceMock{}
			resourceMock.On("UpdateResource").Return(&models.Resource{}, nil)
			resourceController := ResourceController{ResourceRepository: &resourceMock}

			// test
			err := resourceController.UpdateResource(c)
			if assert.NoError(t, err) {
				assert.Equal(t, http.StatusOK, rec.Code)
			}
		})
	}

	t.Run("Update resource successfully with all values", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": "Boton", "code": "1", "cost": 23000.0, "color_id": 1, "supplier_id": 1})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("resourceId")
		c.SetParamValues("1")

		// mocks
		resourceMock := mocks.ResourceMock{}
		resourceMock.On("UpdateResource").Return(&models.Resource{}, nil)
		resourceController := ResourceController{ResourceRepository: &resourceMock}

		// test
		err := resourceController.UpdateResource(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
