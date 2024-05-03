package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadUser(t *testing.T) {

	queryLimit := utils.QueryLimit()

	t.Run("Error on get user from db", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("SelectUsers", &models.Request{Limit: queryLimit}).Return(errors.New("error"))

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Get users succesfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("SelectUsers", &models.Request{Limit: queryLimit}).Return(nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}
