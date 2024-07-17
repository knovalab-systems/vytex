package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func UserExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "User already exists", ""))
}

func ColorExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Color code already exists", ""))
}

func ReferenceExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Reference already exists", ""))
}

func ResourceExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Resource already exists", ""))
}

func FabricExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Fabric already exists", ""))
}
