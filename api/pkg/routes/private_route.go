package routes

import (
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

// Routes without authentication
func PrivateRoutes(e *echo.Echo) {
	// Create route group
	route := e.Group("/api/v1")

	// Config middleware with the custom claims type
	middlewares.JwtMiddleware(route)

}
