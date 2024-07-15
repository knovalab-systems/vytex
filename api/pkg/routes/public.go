package routes

import (
	"github.com/labstack/echo/v4"
)

// Routes without authentication
func PublicRoutes(e *echo.Echo) {
	route := e.Group("/api/v1")

	// add routes
	publicAuthRoutes(route)
	privateFabricRoutes(route)

}
