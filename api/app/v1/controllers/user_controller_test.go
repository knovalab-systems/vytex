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
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadUser(t *testing.T) {

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
		userMock.On("SelectUsers").Return(nil)

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
		userMock.On("SelectUsers").Return(nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateUser(t *testing.T) {

	// dont fail binding on any case

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
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
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
		userMock.On("AggregationUsers", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, nil)
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestUpdateUser(t *testing.T) {

	t.Run("Fail binding, role is a integer", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]int{"role": 32321})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Fail validate, role is a not a uuid", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": "12321321"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues("31b63ffb-15f5-48d7-9a24-587f437f07ec")

		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Fail validate, userId is a not a uuid", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": "31b63ffb-15f5-48d7-9a24-587f437f07ec"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues("2312312")

		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Updates user successfully with role", func(t *testing.T) {
		// context
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": role})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues(id)
		// mocks
		mockUser := mocks.UserMock{}
		mockUser.On("UpdateUser").Return(&models.User{}, errors.New("Error")) // the mock empty for pointer param

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		assert.Error(t, err)

	})

	t.Run("Updates user successfully with delete_at", func(t *testing.T) {
		// context
		delete_at := "2020-12-09T16:09:53+00:00"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"delete_at": delete_at})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues(id)
		// mocks
		mockUser := mocks.UserMock{}
		mockUser.On("UpdateUser").Return(&models.User{}, nil) // the mock empty for pointer param

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

	t.Run("Updates user successfully all values", func(t *testing.T) {
		// context
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		delete_at := "2020-12-09T16:09:53+00:00"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": role, "delete_at": delete_at})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues(id)
		// mocks
		mockUser := mocks.UserMock{}
		mockUser.On("UpdateUser").Return(&models.User{}, nil) // the mock empty for pointer param

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestCreateUser(t *testing.T) {

	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]int{"role": 32321})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.CreateUser(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validate", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": "12321321"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.CreateUser(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail to create User", func(t *testing.T) {
		// context
		name := "test"
		username := "test"
		password := "test"
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "username": username, "password": password, "role": role})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockUser := mocks.UserMock{}

		mockUser.On("CreateUser").Return(&models.User{}, errors.New("error"))

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.CreateUser(c)

		assert.Error(t, err)
	})

	t.Run("Fail to create, user exist", func(t *testing.T) {
		// context
		name := "test"
		username := "test"
		password := "test"
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "username": username, "password": password, "role": role})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockUser := mocks.UserMock{}

		mockUser.On("CreateUser").Return(&models.User{}, nil)
		mockUser.On("CheckUserExistence").Return(true, nil)

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.CreateUser(c)

		if assert.Error(t, err) {
			assert.Equal(t, http.StatusConflict, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Create user successfully", func(t *testing.T) {
		// context
		name := "test"
		username := "test"
		password := "test"
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name, "username": username, "password": password, "role": role})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockUser := mocks.UserMock{}

		mockUser.On("CreateUser").Return(&models.User{}, nil)

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.CreateUser(c)

		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusCreated, rec.Code)
		}
	})

}
