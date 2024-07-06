package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// auth
func AuthBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values for user credentials", ""))
}

func JwtBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Missing access token", ""))
}

// user
func UsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get users", ""))
}

func AggregateUsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get users aggregation", ""))
}

func UpdateUserBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to update user", ""))
}

func CreateUserBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to create user", ""))
}

// color
func ColorsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get colors", ""))
}

func CreateColorBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to create color", ""))
}

// fabric
func FabricsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get fabrics", ""))
}

// resource
func ResourcesBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to get resources", ""))
}

// reference
func CreateReferenceBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, New(code, "", "", "Invalid values to create reference", ""))
}
