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
	privateImageRoute(route)
	privateUserRoutes(route)
	privateColorRoutes(route)
	privateCustomRoutes(route)
	privateFabricRoutes(route)
	privateOrderRoutes(route)
	privateResourceRoutes(route)
	privateSupplierRoutes(route)
	privateReferenceRoutes(route)
	privateOrderStateRoutes(route)
	privateStepRoutes(route)
	privateTaskControlRoutes(route)

}
