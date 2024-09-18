package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/labstack/echo/v4"
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
