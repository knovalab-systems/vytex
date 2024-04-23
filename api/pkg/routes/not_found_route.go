package routes

import (
	"net/http"

	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

// Route for describe 404 Error not found route.
func NotFoundRoute(e *echo.Echo) {
	// Create route group
	route := e.Group("/")

	problemDetails := utils.NewHTTP(http.StatusNotFound)

	route.GET("*", func(c echo.Context) error {
		return c.JSON(http.StatusNotFound, problemDetails)
	})
}
