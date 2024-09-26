package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
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

func TestCreateRole(t *testing.T) {

	testCasesValidateFail := []map[string]interface{}{
		{"name": "supplier"},
		{"policies": []string{"something"}},
		{"name": "", "policies": []string{}},
	}

	for _, v := range testCasesValidateFail {
		t.Run("Fail validate ", func(t *testing.T) {
			// context
			body := new(bytes.Buffer)
			_ = json.NewEncoder(body).Encode(v)
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			roleMock := mocks.RoleMock{}

			// controller
			roleController := RoleController{RoleRepository: &roleMock}
			// test
			err := roleController.CreateRole(c)
			if assert.Error(t, err) {
				assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
			}

		})
	}

	t.Run("Fail create role", func(t *testing.T) {
		// context
		name := "name"
		policies := []string{"policy"}
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "policies": policies})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		roleMock := mocks.RoleMock{}
		roleMock.On("CreateRole", &models.RoleCreateBody{Name: name, Policies: policies}).Return(&models.Role{}, problems.ServerError())

		// controller
		roleController := RoleController{RoleRepository: &roleMock}
		// test
		err := roleController.CreateRole(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Create role successfully", func(t *testing.T) {
		// context
		name := "name"
		policies := []string{"policy"}
		body := new(bytes.Buffer)
		_ = json.NewEncoder(body).Encode(map[string]interface{}{"name": name, "policies": policies})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		roleMock := mocks.RoleMock{}
		roleMock.On("CreateRole", &models.RoleCreateBody{Name: name, Policies: policies}).Return(&models.Role{}, nil)

		// controller
		roleController := RoleController{RoleRepository: &roleMock}
		// test
		err := roleController.CreateRole(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}

	})

}
