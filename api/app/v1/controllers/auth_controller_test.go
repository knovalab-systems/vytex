package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
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

func TestLogin(t *testing.T) {
	t.Run("Fail binding", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]any{"username": 23232})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Fail validation, missing parameters", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Fail validation, length password", func(t *testing.T) {
		// context
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": "jose", "password": "1234567"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not found user", func(t *testing.T) {
		// context
		username := "antonio"
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": username, "password": "antonio1"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("UserForLogin", username).Return(&models.User{}, errors.New("error"))
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusUnauthorized, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Find invalid password", func(t *testing.T) {
		// context
		user := &models.User{ID: "1", Username: "jose", Password: "12345678"}
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": "jose", "password": "antonio1"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("UserForLogin", user.Username).Return(user, nil)
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusUnauthorized, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not generate tokens", func(t *testing.T) {
		// context
		user := &models.User{ID: "1", Username: "jose", Password: "12345678"}
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": "jose", "password": "12345678"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("UserForLogin", user.Username).Return(user, nil)
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", user.ID).Return(errors.New("error"))

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not save refresh token", func(t *testing.T) {
		// context
		user := &models.User{ID: "1", Username: "jose", Password: "12345678"}
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": "jose", "password": "12345678"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("UserForLogin", user.Username).Return(user, nil)
		mockAuth.On("RegisterRefresh", user.ID, "").Return(errors.New("error"))
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", user.ID).Return(nil)

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Login successfully", func(t *testing.T) {
		// context
		user := &models.User{ID: "1", Username: "jose", Password: "12345678"}
		body := new(bytes.Buffer)
		json.NewEncoder(body).Encode(map[string]string{"username": "jose", "password": "12345678"})
		req := httptest.NewRequest(http.MethodPost, "/", body)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("UserForLogin", user.Username).Return(user, nil)
		mockAuth.On("RegisterRefresh", user.ID, "").Return(nil)
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", user.ID).Return(nil)

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Login(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}

	})

}

func TestRefresh(t *testing.T) {
	t.Run("Fail missing cookie", func(t *testing.T) {
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusUnauthorized, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not found refresh token", func(t *testing.T) {
		// context
		cookie := "1"
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, cookie))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(&models.Session{}, errors.New("error"))
		tokenMock := mocks.TokenMock{}

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusUnauthorized, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not generate tokens", func(t *testing.T) {
		// context
		cookie := "1"
		session := &models.Session{UserID: "1", ID: 1}
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, cookie))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(session, nil)
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", session.UserID).Return(errors.New("error"))

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not save refresh token", func(t *testing.T) {
		// context
		cookie := "1"
		session := &models.Session{UserID: "1", ID: 1}
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, cookie))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(session, nil)
		mockAuth.On("RegisterRefresh", session.UserID, "").Return(errors.New("error"))
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", session.UserID).Return(nil)

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Not delete refresh token", func(t *testing.T) {
		t.Parallel()

		cookie := "1"
		session := &models.Session{UserID: "1", ID: 1}

		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, cookie))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(session, nil)
		mockAuth.On("DeleteRefresh", session.ID).Return(errors.New("error"))
		mockAuth.On("RegisterRefresh", session.UserID, "").Return(nil)
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", session.UserID).Return(nil)

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusInternalServerError, err.(*echo.HTTPError).Code)
		}

	})

	t.Run("Successfully refresh", func(t *testing.T) {
		cookie := "1"
		session := &models.Session{UserID: "1", ID: 1}
		// context
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, "1"))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// mocks
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(session, nil)
		mockAuth.On("RegisterRefresh", session.UserID, "").Return(nil)
		mockAuth.On("DeleteRefresh", session.ID).Return(nil)
		tokenMock := mocks.TokenMock{}
		tokenMock.On("GenerateTokens", session.UserID).Return(nil)

		// controller
		controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

		// test
		err := controller.Refresh(c)
		if assert.NoError(t, err) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}

	})

}

func TestLogout(t *testing.T) {
	testCase := []struct {
		Name   string
		Cookie string
		Code   int
	}{
		{Name: "Without Cookie", Code: http.StatusUnauthorized},
		{Name: "Invalid cookie", Cookie: "2", Code: http.StatusUnauthorized},
		{Name: "Error deleting refresh", Cookie: "1", Code: http.StatusInternalServerError},
	}

	// Define a valid session
	validCookie := "1"
	invalidCookie := "2"
	session := &models.Session{UserID: "1", ID: 1}

	for i := range testCase {
		testCase := testCase[i]

		t.Run(testCase.Name, func(t *testing.T) {
			// Create a new HTTP request
			req := httptest.NewRequest(http.MethodPost, "/", nil)
			if len(testCase.Cookie) > 0 {
				req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, testCase.Cookie))
			}
			rec := httptest.NewRecorder()
			e := echo.New()
			c := e.NewContext(req, rec)

			// Define the mock behavior
			mockAuth := mocks.AuthMock{}
			mockAuth.On("ValidRefresh", validCookie).Return(session, nil)
			mockAuth.On("ValidRefresh", invalidCookie).Return(session, errors.New("error"))
			mockAuth.On("DeleteRefresh", session.ID).Return(errors.New("error"))
			mockAuth.On("DeleteRefresh", session.ID).Return(nil)

			// Create the controller with the mock
			controller := AuthController{AuthRepository: &mockAuth}

			// Run the test
			err := controller.Logout(c)
			if assert.Error(t, err) {
				assert.Equal(t, testCase.Code, err.(*echo.HTTPError).Code)
			}
		})

	}

	t.Run("Logout Successfully ", func(t *testing.T) {
		// Create a new HTTP request
		cookie := "1"
		session := &models.Session{UserID: "1", ID: 1}
		req := httptest.NewRequest(http.MethodPost, "/", nil)
		req.Header.Set(echo.HeaderCookie, fmt.Sprintf(`%v="%v"`, utils.RefreshCookieName, cookie))
		rec := httptest.NewRecorder()
		e := echo.New()
		c := e.NewContext(req, rec)

		// Define the mock behavior
		mockAuth := mocks.AuthMock{}
		mockAuth.On("ValidRefresh", cookie).Return(session, nil)
		mockAuth.On("DeleteRefresh", session.ID).Return(nil)

		// Create the controller with the mock
		controller := AuthController{AuthRepository: &mockAuth}

		// Run the test
		if assert.NoError(t, controller.Logout(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
		}
	})
}
