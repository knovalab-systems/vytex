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

func TestReadRoles(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail get roles", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		roleMock := mocks.RoleMock{}
		roleMock.On("SelectRoles").Return(defaultError)

		// controller
		roleController := RoleController{RoleRepository: &roleMock}

		// test
		err := roleController.ReadRoles(c)
		assert.Error(t, err)

	})

	t.Run("Select roles successfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		roleMock := mocks.RoleMock{}
		roleMock.On("SelectRoles").Return(nil)

		// controller
		roleController := RoleController{RoleRepository: &roleMock}

		// test
		err := roleController.ReadRoles(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
