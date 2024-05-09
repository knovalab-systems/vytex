package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadUser(t *testing.T) {

	queryLimit := utils.LimitQuery()

	t.Run("Fail binding", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "uno")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, bad value for limit", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "-2")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, bad value for page", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("page", "-1")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, bad value for page", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("offset", "-1")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Error on get user from db", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
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

	t.Run("Get users succesfully with offset n limit", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "-1")
		q.Set("offset", "1")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("SelectUsers", &models.Request{Limit: queryLimit, Offset: 1}).Return(nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

	t.Run("Get users succesfully with page n limit", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "-1")
		q.Set("page", "2")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("SelectUsers", &models.Request{Limit: queryLimit, Page: 2, Offset: queryLimit}).Return(nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateUser(t *testing.T) {

	t.Run("Fail validation empty fields", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("AggregationUsers", &models.AggregateRequest{Count: ""}).Return(&models.AggregateData{}, nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation empty fields", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("count", "*")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("AggregationUsers", &models.AggregateRequest{Count: "*"}).Return(&models.AggregateData{}, errors.New("error"))

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}
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
		userMock := mocks.UserMock{}
		userMock.On("AggregationUsers", &models.AggregateRequest{Count: "*"}).Return(&models.AggregateData{}, nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
