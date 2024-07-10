package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/mocks"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestReadUsers(t *testing.T) {
	defaultError := errors.New("ERROR")

	t.Run("Fail on get users", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUsers").Return(defaultError)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		assert.Error(t, err)

	})

	t.Run("Get users succesfully ", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUsers").Return(nil)

		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUsers(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestReadUser(t *testing.T) {

	t.Run("Fail binding, id is not find", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
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
		err := controller.ReadUser(c)
		assert.Error(t, err)
	})

	t.Run("Fail binding, id is number", func(t *testing.T) {
		// context
		id := "23232"
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues(id)
		// mocks
		mockUser := mocks.UserMock{}

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.ReadUser(c)
		assert.Error(t, err)
	})

	t.Run("Not find user", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues("31b63ffb-15f5-48d7-9a24-587f437f07ec")

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUser").Return(errors.New("Error"))
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUser(c)
		assert.Error(t, err)
	})

	t.Run("Gets user succesfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.SetParamNames("userId")
		c.SetParamValues("31b63ffb-15f5-48d7-9a24-587f437f07ec")

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUser").Return(nil, nil)
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadUser(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}

func TestReadMe(t *testing.T) {

	t.Run("Not find jwt token", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{}})

		// mocks
		userMock := mocks.UserMock{}
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadMe(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Not find user", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUser").Return(errors.New("Error"))
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadMe(c)
		assert.Error(t, err)
	})

	t.Run("Gets user succesfully", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)
		c.Set("user", &jwt.Token{Claims: &models.JWTClaims{User: "31b63ffb-15f5-48d7-9a24-587f437f07ec"}})

		// mocks
		userMock := mocks.UserMock{}
		userMock.On("ReadUser").Return(nil, nil)
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.ReadMe(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})

}

func TestAggregateUser(t *testing.T) {
	defaultError := errors.New("ERROR")

	// dont fail binding on any case

	t.Run("fail on get aggregate", func(t *testing.T) {
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
		userMock.On("AggregationUsers", &models.AggregateQuery{Count: "*"}).Return(&models.AggregateData{}, defaultError)
		userController := UserController{UserRepository: &userMock}

		// test
		err := userController.AggregateUsers(c)
		assert.Error(t, err)
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

	t.Run("Fail validate, username is a empty string", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": ""})
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

	t.Run("Fail validate, name is a empty string", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": ""})
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

	t.Run("Fail validate, password does not have the expected length", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"password": "123"})
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

	t.Run("Fail username exists", func(t *testing.T) {
		// context
		username := "username"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": username})
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
		mockUser.On("UpdateUser").Return(&models.User{}, errors.New("error")) // the mock empty for pointer param

		// controller
		controller := UserController{UserRepository: &mockUser}

		// test
		err := controller.UpdateUser(c)
		assert.Error(t, err)
	})

	t.Run("Update user successfully with role", func(t *testing.T) {
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

	t.Run("Update user successfully with deleted_at", func(t *testing.T) {
		// context
		deleted_at := "2020-12-09T16:09:53+00:00"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"deleted_at": deleted_at})
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

	t.Run("Update user successfully with username", func(t *testing.T) {
		// context
		username := "username"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": username})
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

	t.Run("Update user successfully with name", func(t *testing.T) {
		// context
		name := "Antonio Banderas"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"name": name})
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

	t.Run("Update user successfully with password", func(t *testing.T) {
		// context
		password := "12345678"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"password": password})
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

	t.Run("Update user successfully all values", func(t *testing.T) {
		// context
		role := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		deleted_at := "2020-12-09T16:09:53+00:00"
		password := "12345678"
		name := "Antonio Banderas"
		id := "31b63ffb-15f5-48d7-9a24-587f437f07ec"
		username := "username"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"role": role, "deleted_at": deleted_at, "username": username,
			"password": password, "name": name})
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

	t.Run("Fail create User", func(t *testing.T) {
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

	t.Run("Fail create, user exist", func(t *testing.T) {
		// context
		name := "test"
		username := "test"
		password := "test123t"
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

		mockUser.On("CreateUser").Return(&models.User{}, problems.UserExists())

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
		password := "test1231"
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
