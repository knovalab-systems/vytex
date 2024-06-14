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

func TestResourcesColors(t *testing.T) {
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
