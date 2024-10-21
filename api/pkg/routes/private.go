package routes

import (
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

// Routes with authentication
func privateRoutes(group *echo.Group) {

	// add jwt middleware
	middlewares.JwtMiddleware(group)

	// add routes
	privateImageRoute(group)
	privateUserRoutes(group)
	privateColorRoutes(group)
	privateCustomRoutes(group)
	privateFabricRoutes(group)
	privateOrderRoutes(group)
	privateResourceRoutes(group)
	privateSupplierRoutes(group)
	privateReferenceRoutes(group)
	privateOrderStateRoutes(group)
	privateStepRoutes(group)
	privateTaskControlRoutes(group)
	privateRoleRoutes(group)
	privateTaskControlStateRoutes(group)
}
