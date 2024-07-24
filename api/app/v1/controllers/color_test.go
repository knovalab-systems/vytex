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

func TestReadColors(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get colors", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColors").Return(defaultError)

		// controller
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColors(c)
		assert.Error(t, err)

	})

	t.Run("Get colors succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColors").Return(nil)

		// controller
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColors(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateColor(t *testing.T) {
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
		colorMock := mocks.ColorMock{}
		colorMock.On("AggregationColors", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.AggregateColors(c)
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
		colorMock := mocks.ColorMock{}
		colorMock.On("AggregationColors", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.AggregateColors(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestCreateColor(t *testing.T) {

	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]int{"name": 32321, "code": 3232, "hex": 3232})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, wrong hexcolor format", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": "Blanco", "code": "1", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, missing name", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"code": "1", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate, missing code", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": "Blanco", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail create, color code exists", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("CreateColor", &models.ColorCreateBody{Name: name, Code: code, Hex: hex}).Return(&models.Color{}, problems.ColorExists())
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.CreateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})
	t.Run("Create color successfully", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("CreateColor", &models.ColorCreateBody{Name: name, Code: code, Hex: hex}).Return(&models.Color{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.CreateColor(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})
}

func TestSelectColor(t *testing.T) {

	t.Run("Fail binding, id is missing", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		// mocks
		mockColor := mocks.ColorMock{}

		// controller
		controller := ColorController{ColorRepository: &mockColor}

		// test
		err := controller.ReadColor(c)
		assert.Error(t, err)
	})

	t.Run("Fail binding, id is uint", func(t *testing.T) {
		// context
		id := "unId"
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues(id)
		// mocks
		mockColor := mocks.ColorMock{}

		// controller
		controller := ColorController{ColorRepository: &mockColor}

		// test
		err := controller.ReadColor(c)
		assert.Error(t, err)
	})

	t.Run("Not find color", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues("1")

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColor").Return(errors.New("Error"))
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColor(c)
		assert.Error(t, err)
	})

	t.Run("Gets color succesfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues("1")

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("SelectColor").Return(nil, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.ReadColor(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestUpdateColor(t *testing.T) {

	t.Run("Fail binding, id is missing", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		// mocks
		mockColor := mocks.ColorMock{}

		// controller
		controller := ColorController{ColorRepository: &mockColor}

		// test
		err := controller.UpdateColor(c)
		assert.Error(t, err)
	})

	t.Run("Fail binding, id is not uint", func(t *testing.T) {
		// context
		id := "unId"
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues(id)
		// mocks
		mockColor := mocks.ColorMock{}

		// controller
		controller := ColorController{ColorRepository: &mockColor}

		// test
		err := controller.UpdateColor(c)
		assert.Error(t, err)
	})

	t.Run("Fail validate, wrong hexcolor format", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": "Blanco", "code": "1", "hex": "FFFFFF"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		colorMock := mocks.ColorMock{}

		// controller
		colorController := ColorController{ColorRepository: &colorMock}
		// test
		err := colorController.UpdateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, color code exists", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		id := "1"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues(id)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("UpdateColor").Return(&models.Color{}, problems.ColorExists())
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.UpdateColor(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})

	testCasesOneValue := []models.ColorUpdateBody{{
		Name: "Blanco",
	},
		{Code: "1"},
		{Hex: "#FFFFFF"},
	}

	for i := range testCasesOneValue {
		testCase := testCasesOneValue[i]
		t.Run("Update color successfully on some values", func(t *testing.T) {
			// context
			id := "1"
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(map[string]string{"name": testCase.Name, "code": testCase.Code, "hex": testCase.Hex})
			req := httptest.NewRequest(http.MethodGet, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)
			c.SetParamNames("colorId")
			c.SetParamValues(id)

			// mocks
			colorMock := mocks.ColorMock{}
			colorMock.On("UpdateColor").Return(&models.Color{}, nil)
			colorController := ColorController{ColorRepository: &colorMock}

			// test
			err := colorController.UpdateColor(c)
			if assert.NoError(t, err) {
				assert.Equal(t, http.StatusOK, rec.Code)
			}
		})
	}

	t.Run("Update color successfully with delete_ay", func(t *testing.T) {
		// context
		deleted_at := "2020-12-09T16:09:53+00:00"
		id := "1"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"delete_at": deleted_at})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues(id)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("UpdateColor").Return(&models.Color{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.UpdateColor(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

	t.Run("Update color successfully on all values", func(t *testing.T) {
		// context
		name := "Blanco"
		code := "1"
		hex := "#FFFFFF"
		deleted_at := "2020-12-09T16:09:53+00:00"
		id := "1"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "code": code, "hex": hex, "delete_at": deleted_at})
		req := httptest.NewRequest(http.MethodGet, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("colorId")
		c.SetParamValues(id)

		// mocks
		colorMock := mocks.ColorMock{}
		colorMock.On("UpdateColor").Return(&models.Color{}, nil)
		colorController := ColorController{ColorRepository: &colorMock}

		// test
		err := colorController.UpdateColor(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
