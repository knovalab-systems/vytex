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

func TestReadSteps(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail steps steps", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		stepMock := mocks.StepMock{}
		stepMock.On("SelectSteps").Return(defaultError)

		// controller
		stepController := StepController{StepRepository: &stepMock}

		// test
		err := stepController.ReadSteps(c)
		assert.Error(t, err)

	})

	t.Run("Select steps successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		stepMock := mocks.StepMock{}
		stepMock.On("SelectSteps").Return(nil)

		// controller
		stepController := StepController{StepRepository: &stepMock}

		// test
		err := stepController.ReadSteps(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
