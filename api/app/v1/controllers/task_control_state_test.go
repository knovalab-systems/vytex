package controllers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadTaskControlStatus(t *testing.T) {

	t.Run("Fail select task control status", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlStateMock := mocks.TaskControlStateMock{}
		taskControlStateMock.On("SelectTaskControlStatus").Return(problems.ServerError())

		// controller
		taskControlStateController := TaskControlStateController{TaskControlStateRepository: &taskControlStateMock}

		// test
		err := taskControlStateController.ReadTaskControlStatus(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Select task control status successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		taskControlStateMock := mocks.TaskControlStateMock{}
		taskControlStateMock.On("SelectTaskControlStatus").Return(nil)

		// controller
		taskControlStateController := TaskControlStateController{TaskControlStateRepository: &taskControlStateMock}

		// test
		err := taskControlStateController.ReadTaskControlStatus(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
