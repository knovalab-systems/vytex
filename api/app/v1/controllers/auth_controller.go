package controllers

import (
	"net/http"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
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
// @Param		 request body models.LoginUser true "User's credentials"
// @Success      200 {object} models.DataAuthResponse
// @Failure      400
// @Failure      401
// @Failure      500
// @Router       /auth/login [post]
func (m *AuthController) Login(c echo.Context) error {
	// for keep user
	u := new(models.LoginUser)

	// body bind
	if err := c.Bind(u); err != nil {
		return problems.AuthBadRequest()
	}

	// body validation
	if err := c.Validate(u); err != nil {
		return problems.AuthBadRequest()
	}

	// get user
	user, err := m.AuthRepository.ValidUser(u.Username, u.Password)
	if err != nil {
		return problems.AuthUnauthorized()
	}

	// generate tokens
	tokens, err := m.Credentials(user.ID, user.Role)
	if err != nil {
		return problems.ServerError()
	}

	// create n set cookie
	refreshCookie := generateRefreshCookie(tokens.Refresh, tokens.RefreshExpiresAt)
	c.SetCookie(refreshCookie)

	res := models.DataAuthResponse{
		AccessToken: tokens.Access,
		Expires:     utils.AccessExpires.Milliseconds(),
	}

	return c.JSON(http.StatusOK, res)
}

// Refresh user credentials
// @Summary      Refresh
// @Description  Given a correct refresh cookie get access
// @Tags         Auth
// @Produce      json
// @Success      200 {object} models.DataAuthResponse
// @Failure      401
// @Failure      500
// @Router       /auth/refresh [post]
func (m *AuthController) Refresh(c echo.Context) error {
	// get the cookie with refresh token
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return problems.RefreshUnauthorized()
	}

	// check refresh in db
	s, err := m.ValidRefresh(cookie.Value)
	if err != nil {
		return problems.RefreshUnauthorized()
	}

	// generate tokens
	tokens, err := m.Credentials(s.UserID, s.User.Role)
	if err != nil {
		return problems.ServerError()
	}

	// delete old refresh
	err = m.AuthRepository.DeleteRefresh(s.ID)
	if err != nil {
		return problems.ServerError()
	}

	// create n set cookie
	refreshCookie := generateRefreshCookie(tokens.Refresh, tokens.RefreshExpiresAt)
	c.SetCookie(refreshCookie)

	res := models.DataAuthResponse{
		AccessToken: tokens.Access,
		Expires:     utils.AccessExpires.Milliseconds(),
	}

	return c.JSON(http.StatusOK, res)
}

// Logout user
// @Summary      Logout
// @Description  Remove the refresh token from the database and delete the cookie
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Success      204
// @Failure      401
// @Failure      500
// @Router       /auth/logout [post]
func (m *AuthController) Logout(c echo.Context) error {

	// get the cookie with refresh token
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return problems.RefreshUnauthorized()
	}

	// check refresh in db
	s, err := m.AuthRepository.ValidRefresh(cookie.Value)
	if err != nil {
		return problems.RefreshUnauthorized()
	}

	// delete old refresh
	err = m.AuthRepository.DeleteRefresh(s.ID)
	if err != nil {
		return problems.ServerError()
	}

	c.SetCookie(&http.Cookie{
		Name:     utils.RefreshCookieName,
		Value:    "",
		Expires:  time.Now(),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   -1,
	})

	return c.NoContent(http.StatusNoContent)

}

func generateRefreshCookie(token string, expiresAt time.Time) *http.Cookie {
	c := new(http.Cookie)
	c.Name = utils.RefreshCookieName
	c.Value = token
	c.Expires = expiresAt
	c.HttpOnly = true
	c.SameSite = http.SameSiteLaxMode
	c.Path = "/"
	c.MaxAge = int(utils.RefreshExpires.Seconds())

	return c
}
