package controllers

import (
	"net/http"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/repository"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

type AuthController struct {
	repository.AuthRepository
}

// Login user
// @Summary      Login
// @Description  Given a correct user name and password get access
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param		 username body string true "User's username"
// @Param		 password body string true "User's password"
// @Success      200 {object} models.LoginResponse
// @Failure      400
// @Failure      401
// @Failure      500
// @Router       /login [post]
func (m *AuthController) Login(c echo.Context) error {

	// for keep user
	u := new(models.LoginUser)

	// body validation
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	if err := c.Validate(u); err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	// get user
	user, err := m.AuthRepository.UserForLogin(u.UserName)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	//pending to encrypt pass

	// check user
	if u.UserName != user.UserName || u.Password != user.Password {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	// generate tokens
	expires := time.Now().Add(utils.RefreshExpires)
	tokens, err := utils.GenerateTokens(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, utils.ServerErrorProblemDetails())
	}

	// save refresh token
	err = m.AuthRepository.RegisterRefresh(user.ID, tokens.Refresh, expires)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, utils.ServerErrorProblemDetails())
	}

	// create n set cookie
	// create n set cookie
	refreshCookie := generateRefreshCookie(expires, tokens.Refresh)
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, models.AuthResponse{
		Data: models.DataAuthResponse{
			AccessToken: tokens.Access,
			Expires:     utils.AccessExpires.Milliseconds(),
		},
	})
}

// Refresh user credentials
// @Summary      Refresh
// @Description  Given a correct refresh cookie get access
// @Tags         Auth
// @Produce      json
// @Success      200 {object} models.LoginResponse
// @Failure      401
// @Failure      500
// @Router       /refresh [post]
func (m *AuthController) Refresh(c echo.Context) error {
	// get the cookie with refresh token
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	// check refresh in db
	s, err := m.ValidRefresh(cookie.Value)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	// generate tokens
	expires := time.Now().Add(utils.RefreshExpires)
	tokens, err := utils.GenerateTokens(s.UserID)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, utils.AuthProblemDetails())
	}

	// save refresh token
	err = m.AuthRepository.RegisterRefresh(s.UserID, tokens.Refresh, expires)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, utils.ServerErrorProblemDetails())
	}

	// delete old refresh
	err = m.AuthRepository.DeleteRefresh(s.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, utils.ServerErrorProblemDetails())
	}

	// create n set cookie
	refreshCookie := generateRefreshCookie(expires, tokens.Refresh)
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, models.AuthResponse{
		Data: models.DataAuthResponse{
			AccessToken: tokens.Access,
			Expires:     utils.AccessExpires.Milliseconds(),
		},
	})
}

func generateRefreshCookie(expires time.Time, token string) *http.Cookie {
	c := new(http.Cookie)
	c.Name = utils.RefreshCookieName
	c.Value = token
	c.Expires = expires
	c.HttpOnly = true
	c.SameSite = http.SameSiteLaxMode
	c.Path = "/"
	c.MaxAge = int(utils.RefreshExpires.Seconds())

	return c
}
