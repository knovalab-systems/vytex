package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func JWTUnauthorized() *echo.HTTPError {
	code := http.StatusUnauthorized
	return echo.NewHTTPError(code, New(code, "", "", "Invalid or missing access token", ""))
}

func AuthUnauthorized() *echo.HTTPError {
	code := http.StatusUnauthorized
	return echo.NewHTTPError(code, New(code, "", "", "Invalid user credentials", ""))
}

func RefreshUnauthorized() *echo.HTTPError {
	code := http.StatusUnauthorized
	return echo.NewHTTPError(code, New(code, "", "", "Invalid or missing refresh token", ""))
}
