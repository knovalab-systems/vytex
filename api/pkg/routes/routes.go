package routes

import (
	"github.com/labstack/echo/v4"
)

func Routes(e *echo.Echo) {

	notFoundRoute(e)
	swaggerRoutes(e)

	g := e.Group("/api/v1")
	publicRoutes(g)
	privateRoutes(g)
	notFoundRoute(g)

}
