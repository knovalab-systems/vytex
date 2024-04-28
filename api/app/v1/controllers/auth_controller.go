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
func (m *AuthController) Login(c echo.Context) (err error) {

	// for keep user
	u := new(models.LoginUser)

	// body validation
	if err = c.Bind(u); err != nil {
		return utils.NewHTTPError(http.StatusBadRequest)
	}

	if err = c.Validate(u); err != nil {
		return utils.NewHTTPError(http.StatusBadRequest)
	}

	// get user
	user, err := m.AuthRepository.UserForLogin(u.UserName)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	//pending to encrypt pass

	// check user
	if u.UserName != user.UserName || u.Password != user.Password {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// generate tokens
	expires := time.Now().Add(utils.RefreshExpires)
	tokens, err := utils.GenerateTokens(user.ID)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// save refresh token
	err = m.AuthRepository.RegisterRefresh(user.ID, tokens.Refresh, expires)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// create n set cookie
	// create n set cookie
	refreshCookie := generateRefreshCookie(expires, tokens.Refresh)
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, utils.NewResponseData(models.LoginResponse{
		AccessToken: tokens.Access,
		Expires:     utils.AccessExpires.Milliseconds(),
	}))
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
func (m *AuthController) Refresh(c echo.Context) (err error) {
	// get the cookie with refresh token
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// check refresh in db
	s, err := m.ValidRefresh(cookie.Value)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// generate tokens
	expires := time.Now().Add(utils.RefreshExpires)
	tokens, err := utils.GenerateTokens(s.UserID)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// save refresh token
	err = m.AuthRepository.RegisterRefresh(s.UserID, tokens.Refresh, expires)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// delete old refresh
	err = m.AuthRepository.DeleteRefresh(s.ID)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// create n set cookie
	refreshCookie := generateRefreshCookie(expires, tokens.Refresh)
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, utils.NewResponseData(models.LoginResponse{
		AccessToken: tokens.Access,
		Expires:     utils.AccessExpires.Milliseconds(),
	}))
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

// Logout user
// @Summary      Logout
// @Description  Remove the refresh token from the database and delete the cookie
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Success      200
// @Failure      401
// @Failure      500
// @Router       /logout [post]
func (m *AuthController) Logout(c echo.Context) (err error) {
	// get the cookie using the name
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// check refresh in db
	s, err := m.AuthRepository.ValidRefresh(cookie.Value)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// delete old refresh
	err = m.AuthRepository.DeleteRefresh(s.ID)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// delete cookie
	clearRefreshCookie(c)

	return c.JSON(http.StatusOK, utils.NewResponseData(nil))
}

func clearRefreshCookie(c echo.Context) {
	c.SetCookie(&http.Cookie{
		Name:     utils.RefreshCookieName,
		Value:    "",
		Expires:  time.Now(),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   -1,
	})
}
