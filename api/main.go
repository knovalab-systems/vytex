package main

import (
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/knovalab-systems/vytex/pkg/routes"

	"github.com/labstack/echo/v4"
)

// @title Vytex API
// @version 0.0
// @BasePath /api/v1
// @accept json
func main() {
	e := echo.New()

	middlewares.EchoMiddleware(e)

	routes.PublicRoutes(e)
	routes.SwaggerRoute(e)
	routes.NotFoundRoute(e)

	e.Logger.Fatal(e.Start(":8080"))
}
