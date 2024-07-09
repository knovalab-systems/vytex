package routes

import (
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

// Routes with authentication
func PrivateRoutes(e *echo.Echo) {
	route := e.Group("/api/v1")

	// add jwt middleware
	middlewares.JwtMiddleware(route)

	// add routes
	privateUserRoutes(route)
	privateColorRoutes(route)
	privateFabricRoutes(route)
	privateResourceRoutes(route)
	privateReferenceRoutes(route)
	privateImageRoute(route)
}
