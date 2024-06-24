package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func UserExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, New(code, "", "", "User already exists", ""))
}

func ReferenceExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, New(code, "", "", "Reference already exists", ""))
}
