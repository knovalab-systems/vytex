package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// auth
func AuthBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values for user credentials", ""))
}

func JwtBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Missing access token", ""))
}

// user
func UsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get users", ""))
}

func AggregateUsersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get users aggregation", ""))
}

func UpdateUserBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to update user", ""))
}

func CreateUserBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create user", ""))
}

// color
func ColorsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get colors", ""))
}

func AggregateColorsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get colors aggregation", ""))
}

func CreateColorBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create color", ""))
}

func UpdateColorBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to update color", ""))
}

// fabric
func FabricsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get fabrics", ""))
}

func CreateFabricBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create fabric", ""))
}

func AggregateFabricsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get fabrics aggregation", ""))
}

func UpdateFabricBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to update fabric", ""))
}

// resource
func ResourceBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get resources", ""))
}

func ResourcesBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get resources", ""))
}

func CreateResourceBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create resource", ""))
}

func UpdateResourceBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to update resource", ""))
}

// reference
func ReferencesBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get references", ""))
}

func AggregateReferencesBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get references aggregation", ""))

}

func CreateReferenceBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create reference", ""))
}

// supplier
func SuppliersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get suppliers", ""))
}

func AggregateSuppliersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get users suppliers", ""))
}

func CreateSupplierBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create supplier", ""))
}

func UpdateSupplierBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to update supplier", ""))
}

// image
func ImagesBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create images", ""))
}

// custom
func CustomsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get customs", ""))
}

func AggregateCustomsBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get customs aggregation", ""))
}

func CreateCustomBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create custom", ""))
}

// Order
func CreateOrderBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to create order", ""))
}

func AggregateOrdersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get orders aggregation", ""))
}

func OrdersBadRequest() *echo.HTTPError {
	code := http.StatusBadRequest
	return echo.NewHTTPError(code, NewPD(code, "", "", "Invalid values to get orders", ""))
}
