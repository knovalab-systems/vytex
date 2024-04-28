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
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestLogin(t *testing.T) {
	testCases := []struct {
		Name   string
		Params map[string]string
		Code   int
	}{
		{Name: "Without params", Params: map[string]string{"user": "pass"}, Code: http.StatusUnauthorized},
		{Name: "Fail validation", Params: map[string]string{"username": "jose", "password": "1234567"}, Code: http.StatusUnauthorized},
		{Name: "Not found user", Params: map[string]string{"username": "antonio", "password": "antonio1"}, Code: http.StatusUnauthorized},
		{Name: "Invalid password", Params: map[string]string{"username": "jose", "password": "antonio1"}, Code: http.StatusUnauthorized},
		{Name: "Success login", Params: map[string]string{"username": "jose", "password": "12345678"}, Code: http.StatusOK},
	}

	authorizedUser := &models.User{ID: "1", UserName: "jose", Password: "12345678"}
	unauthorizedUser := &models.User{UserName: "antonio", Password: "123456789"}

	for i := range testCases {
		testCase := testCases[i]

		t.Run(testCase.Name, func(t *testing.T) {
			t.Parallel()

			// context
			body := new(bytes.Buffer)
			json.NewEncoder(body).Encode(testCase.Params)
			req := httptest.NewRequest(http.MethodPost, "/", body)
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			e := echo.New()
			config.EchoValidator(e)
			c := e.NewContext(req, rec)

			// mocks
			mockAuth := mocks.AuthMock{}
			mockAuth.On("UserForLogin", authorizedUser.UserName).Return(authorizedUser, nil)
			mockAuth.On("UserForLogin", unauthorizedUser.UserName).Return(unauthorizedUser, errors.New("error"))
			mockAuth.On("RegisterRefresh", authorizedUser.ID, authorizedUser.ID).Return(nil)
			tokenMock := mocks.TokenMock{}
			tokenMock.On("GenerateTokens", authorizedUser.ID).Return(authorizedUser.ID)

			// controller
			controller := AuthController{AuthRepository: &mockAuth, TokensRepository: &tokenMock}

			// test
			if assert.NoError(t, controller.Login(c)) {
				assert.Equal(t, testCase.Code, rec.Code)
			}

		})
	}

}
