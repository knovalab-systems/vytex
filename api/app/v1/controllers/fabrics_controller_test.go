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

func TestFabricsColors(t *testing.T) {
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
		err := fabricController.ReadResources(c)
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
		err := fabricController.ReadResources(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}
