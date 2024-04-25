package controllers

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/queries"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

// Login user
// @Summary      Login
// @Description  Given a correct user name and password get access
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param		 username body string true "User's username"
// @Param		 password body string true "User's password"
// @Success      200 {object} models.LoginRespose
// @Failure      400
// @Failure      401
// @Failure      500
// @Router       /login [post]
func Login(c echo.Context) (err error) {

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
	user, err := queries.UserForLogin(u.UserName)
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
	err = queries.RegisterRefresh(user.ID, tokens.Refresh, expires)
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

func Refresh(c echo.Context) (err error) {
	// get the cookie with refresh token
	cookie, err := c.Cookie(utils.RefreshCookieName)
	if err != nil {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// get the user from jwt
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*utils.JWTClaims)
	userId := claims.UserId

	// check refresh in db
	s, err := queries.ValidRefresh(userId, cookie.Value)
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
	err = queries.RegisterRefresh(s.UserID, tokens.Refresh, expires)
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
