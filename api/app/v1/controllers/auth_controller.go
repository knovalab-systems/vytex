package controllers

import (
	"net/http"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
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

	// get user, peding
	user := "jose"
	pass := "12345678"

	// check user
	if u.UserName != user || u.Password != pass {
		return utils.NewHTTPError(http.StatusUnauthorized)
	}

	// generate tokends
	tokens, err := utils.GenerateTokens(u.UserName)
	if err != nil {
		return utils.NewHTTPError(http.StatusInternalServerError)
	}

	// create n set cookie
	refreshCookie := new(http.Cookie)
	refreshCookie.Name = utils.RefreshCookieName
	refreshCookie.Value = tokens.Refresh
	refreshCookie.Expires = time.Now().Add(utils.RefreshExpires)
	refreshCookie.HttpOnly = true
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, models.LoginResponse{
		AccessToken: tokens.Access,
		Expires:     utils.AccessExpires.Milliseconds(),
	})
}
