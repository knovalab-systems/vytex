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

func TestReadFabrics(t *testing.T) {
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

func TestReadFabric(t *testing.T) {
	t.Run("Fail binding, id is not find", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.ReadFabric(c)
		assert.Error(t, err)
	})

	t.Run("Not found fabric", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("fabricId")
		c.SetParamValues("1")

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("SelectFabric").Return(errors.New("error"))
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.ReadFabric(c)
		assert.Error(t, err)
	})

	t.Run("Get fabric successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("fabricId")
		c.SetParamValues("1")

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("SelectFabric").Return(nil, nil)
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.ReadFabric(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestAggregateFabrics(t *testing.T) {
	t.Run("Fail on get aggregate", func(t *testing.T) {
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
		fabricMock.On("AggregationFabrics", &models.AggregateQuery{Count: "*"}).Return(map[string]interface{}{}, errors.New("ERROR"))
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
		fabricMock.On("AggregationFabrics", &models.AggregateQuery{Count: "*"}).Return(map[string]interface{}{}, nil)
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.AggregateFabrics(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestCreateFabric(t *testing.T) {

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
		fabricMock := mocks.FabricMock{}

		// controller
		fabricController := FabricController{FabricRepository: &fabricMock}
		// test
		err := fabricController.CreateFabric(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	missingFieldsTestCases := []models.FabricCreateBody{{
		Name:        "tela",
		Cost:        12000.0,
		Code:        "1",
		Color:       1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Name:        "tela",
		Cost:        12000.0,
		Code:        "1",
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Name:        "tela",
		Cost:        12000.0,
		Color:       1,
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Name:        "tela",
		Code:        "1",
		Color:       1,
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Cost:        12000.0,
		Code:        "1",
		Color:       1,
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Cost:     12000.0,
		Code:     "1",
		Color:    1,
		Supplier: 1,
		Name:     "tela",
	}}

	for i := range missingFieldsTestCases {
		testCase := missingFieldsTestCases[i]

		t.Run("Fail validate, missing field or zero value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{"name": testCase.Name, "code": testCase.Code,
				"cost": testCase.Cost, "supplier_id": testCase.Supplier, "color_id": testCase.Color, "composition": testCase.Composition})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			fabricMock := mocks.FabricMock{}

			// controller
			fabricController := FabricController{FabricRepository: &fabricMock}
			// test
			err := fabricController.CreateFabric(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})

	}

	gtZeroTestCases := []models.FabricCreateBody{{
		Cost:        12000.0,
		Color:       0,
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Cost:        0.0,
		Color:       1,
		Supplier:    1,
		Composition: models.Composition{Algod: 10000},
	}, {
		Cost:        12000.0,
		Color:       1,
		Supplier:    0,
		Composition: models.Composition{Algod: 10000},
	}}

	for i := range gtZeroTestCases {
		testCase := gtZeroTestCases[i]

		t.Run("Fail validate, cost less than 0", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{"name": "Blanco", "code": "1", "cost": testCase.Cost,
				"supplier_id": testCase.Supplier, "color_id": testCase.Color})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			fabricMock := mocks.FabricMock{}

			// controller
			fabricController := FabricController{FabricRepository: &fabricMock}
			// test
			err := fabricController.CreateFabric(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}
		})
	}

	t.Run("Fail create, fabric code exists", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		cost := 23000.0
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "cost": cost, "supplier_id": 1,
			"color_id": 1, "composition": map[string]interface{}{"algod": 10000}})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("CreateFabric", &models.FabricCreateBody{Name: name, Code: code, Cost: cost, Color: 1, Supplier: 1,
			Composition: models.Composition{Algod: 10000}}).Return(&models.Fabric{}, problems.FabricExists())
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.CreateFabric(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})
	t.Run("Create fabric successfully", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		cost := 23000.0
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "code": code, "cost": cost, "supplier_id": 1, "color_id": 1,
			"composition": map[string]interface{}{"algod": 10000}})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("CreateFabric", &models.FabricCreateBody{Name: name, Code: code, Cost: cost, Color: 1, Supplier: 1,
			Composition: models.Composition{Algod: 10000}}).Return(&models.Fabric{}, nil)
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.CreateFabric(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}

func TestUpdateFabric(t *testing.T) {
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
		fabricMock := mocks.FabricMock{}

		// controller
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.UpdateFabric(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, fabric code exits", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"code": "1"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("fabricId")
		c.SetParamValues("1")

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("UpdateFabric").Return(&models.Fabric{}, errors.New("error"))
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.UpdateFabric(c)
		assert.Error(t, err)
	})

	testCasesOneValue := map[string]interface{}{
		"name":        "Boton",
		"code":        "1",
		"cost":        23000.0,
		"color_id":    1,
		"supplier_id": 1,
		"deleted_at":  "2021-09-01T00:00:00Z",
		"composition": models.Composition{Algod: 10000},
	}

	for key, value := range testCasesOneValue {
		t.Run("Update fabric successfully with some value", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]interface{}{key: value})
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.SetParamNames("fabricId")
			c.SetParamValues("1")

			// mocks
			fabricMock := mocks.FabricMock{}
			fabricMock.On("UpdateFabric").Return(&models.Fabric{}, nil)
			fabricController := FabricController{FabricRepository: &fabricMock}

			// test
			err := fabricController.UpdateFabric(c)
			if assert.NoError(t, err) {
				assert.Equal(t, http.StatusOK, rec.Code)
			}
		})
	}

	t.Run("Update fabric successfully with all values", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]interface{}{"name": "Boton", "code": "1", "cost": 23000.0, "color_id": 1,
			"supplier_id": 1, "composition": models.Composition{Algod: 10000}})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("fabricId")
		c.SetParamValues("1")

		// mocks
		fabricMock := mocks.FabricMock{}
		fabricMock.On("UpdateFabric").Return(&models.Fabric{}, nil)
		fabricController := FabricController{FabricRepository: &fabricMock}

		// test
		err := fabricController.UpdateFabric(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
