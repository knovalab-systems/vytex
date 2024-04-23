package controllers

import (
	"net/http"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

func Login(c echo.Context) (err error) {

	// for keep user
	u := new(models.LoginUser)

	// body validation
	if err = c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Payload")
	}

	if err = c.Validate(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid Payload")
	}

	// get user, peding
	user := "jose"
	pass := "12345678"

	// check user
	if u.UserName != user || u.Password != pass {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid Payload")
	}

	// generate tokends
	tokens, err := utils.GenerateTokens(u.UserName)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	// create n set cookie
	refreshCookie := new(http.Cookie)
	refreshCookie.Name = utils.RefreshCookieName
	refreshCookie.Value = tokens.Refresh
	refreshCookie.Expires = time.Now().Add(utils.RefreshExpires)
	refreshCookie.HttpOnly = true
	c.SetCookie(refreshCookie)

	return c.JSON(http.StatusOK, echo.Map{
		"access_token": tokens.Access,
		"expires":      utils.AccessExpires.Milliseconds(),
	})
}
