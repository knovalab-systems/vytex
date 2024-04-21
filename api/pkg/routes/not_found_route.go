package routes

import (
	"net/http"

	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

// NotFoundRoute func for describe 404 Error route.
func NotFoundRoute(a *echo.Echo) {
	// Create route group
	route := a.Group("/")

	problemDetails := utils.NewHTTP(http.StatusNotFound)

	route.GET("*", func(c echo.Context) error {
		return c.JSON(http.StatusNotFound, problemDetails)
	})
}
