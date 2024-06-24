package problems

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func UserExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, New(code, "", "", "User already exists", ""))
}
