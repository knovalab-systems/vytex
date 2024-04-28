package routes

import (
	"net/http"

	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/queries"
	"github.com/labstack/echo/v4"
)

// Routes without authentication
func PublicRoutes(e *echo.Echo) {
	// Create route group
	route := e.Group("/api/v1")

	route.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	authController := controllers.AuthController{AuthRepository: &queries.AuthQuery{}}

	// auth routes
	route.POST("/login", authController.Login)
	route.POST("/refresh", authController.Refresh)
	route.POST("/logout", authController.Logout)

}
