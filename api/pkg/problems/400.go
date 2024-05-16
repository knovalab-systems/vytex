package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func AuthBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values for user credentials", ""))
}

func JwtBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Missing access token", ""))
}

func UsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get users resources", ""))
}

func AggregateUsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get users aggregation resources", ""))
}

func UpdateUsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to update user", ""))
}
