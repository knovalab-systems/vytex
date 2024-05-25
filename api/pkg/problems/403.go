package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ReadAccess() *echo.HTTPError {
	code := http.StatusForbidden
	return echo.NewHTTPError(code, New(code, "", "", "You don't have permission to access this.", ""))
}
