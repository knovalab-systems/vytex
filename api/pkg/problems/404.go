package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RouteNotFound() *echo.HTTPError {
	code := http.StatusNotFound
	return echo.NewHTTPError(code, New(code, "", "", "The server cannot find the requested route", ""))
}
