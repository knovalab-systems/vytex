package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ServerError() *echo.HTTPError {
	code := http.StatusInternalServerError
	return echo.NewHTTPError(code, NewPD(code, "", "", "An unexpected condition was encountered", ""))
}
