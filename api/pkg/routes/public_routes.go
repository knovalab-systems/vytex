package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func PublicRoutes(a *echo.Echo) {
	// Create route group
	route := a.Group("/api/v1")

	route.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

}
