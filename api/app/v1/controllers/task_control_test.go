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
	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestReadTaskControls(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail select taskcontrols", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("SelectTaskControls").Return(defaultError)

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}

		// test
		err := taskControlController.ReadTaskControls(c)
		assert.Error(t, err)

	})

	t.Run("Select taskcontrols successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("SelectTaskControls").Return(nil)

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}

		// test
		err := taskControlController.ReadTaskControls(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestAggregateTaskControls(t *testing.T) {

	t.Run("Fail on get aggregate taskcontrols", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("AggregationTaskControls", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, errors.New("ERROR"))

		// controller
		controller := TaskControlController{TaskControlRepository: &taskControlMock}

		// test
		err := controller.AggregateTaskControls(c)
		assert.Error(t, err)
	})

	t.Run("Get aggregate taskcontrols succesfully ", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("AggregationTaskControls", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)

		// controller
		controller := TaskControlController{TaskControlRepository: &taskControlMock}

		// test
		err := controller.AggregateTaskControls(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestUpdateTaskControl(t *testing.T) {

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
		taskControlMock := mocks.TaskControlMock{}

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}
		err := taskControlController.UpdateTaskControl(c)

		// test
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, policies doest exists", func(t *testing.T) {
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
		c.SetParamNames("taskControlid")
		c.SetParamValues(id)

		// mocks
		taskControlMock := mocks.TaskControlMock{}

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}
		err := taskControlController.UpdateTaskControl(c)

		// test
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, read access problem", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("taskControlid")
		c.SetParamValues("1")
		c.Set("policies", pq.StringArray{})

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("UpdateTaskControl").Return(&models.TaskControl{}, problems.ReadAccess())

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}
		err := taskControlController.UpdateTaskControl(c)

		// test
		// test
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusForbidden, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail update, server error", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("taskControlid")
		c.SetParamValues("1")
		c.Set("policies", pq.StringArray{})

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("UpdateTaskControl").Return(&models.TaskControl{}, problems.ServerError())

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}
		err := taskControlController.UpdateTaskControl(c)

		// test
		// test
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Update task control successfully", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("taskControlid")
		c.SetParamValues("1")
		c.Set("policies", pq.StringArray{})

		// mocks
		taskControlMock := mocks.TaskControlMock{}
		taskControlMock.On("UpdateTaskControl").Return(&models.TaskControl{}, nil)

		// controller
		taskControlController := TaskControlController{TaskControlRepository: &taskControlMock}
		err := taskControlController.UpdateTaskControl(c)

		// test
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}
