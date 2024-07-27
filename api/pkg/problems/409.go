package problems

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// user
func UserExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "User already exists", ""))
}

// color
func ColorExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Color code already exists", ""))
}

// reference
func ReferenceExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Reference code already exists", ""))
}

// resource
func ResourceExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Resource already exists", ""))
}

// fabric
func FabricExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Fabric code already exists", ""))
}

// supplier
func SupplierCodeNitExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Supplier code and nit already exists", ""))
}

func SupplierCodeExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Supplier code already exists", ""))
}

func SupplierNitExists() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Supplier NIT already exists", ""))
}

// Order
func OrderFinished() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Order already finished", ""))
}

func OrderCanceled() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Order already canceled", ""))
}

func OrderFinishedCanceled() *echo.HTTPError {
	code := http.StatusConflict
	return echo.NewHTTPError(code, NewPD(code, "", "", "Order already finished and canceled", ""))
}
