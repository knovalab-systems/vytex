package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// Routes without authentication
func PublicRoutes(e *echo.Echo) {
	// Create route group
	route := e.Group("/api/v1")

	route.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

}
