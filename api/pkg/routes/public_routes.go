package routes

import (
	"github.com/labstack/echo/v4"
)

// Routes without authentication
func PublicRoutes(e *echo.Echo) {
	// Create route group
	route := e.Group("/api/v1")

	// Routes
	publicAuthRoutes(route)

}
