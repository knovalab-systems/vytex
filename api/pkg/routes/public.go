package routes

import (
	"github.com/labstack/echo/v4"
)

// Routes without authentication
func publicRoutes(group *echo.Group) {

	// add routes
	publicAuthRoutes(group)
}
