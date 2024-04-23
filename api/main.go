package main

import (
	"github.com/knovalab-systems/vytex/pkg/configs"
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

	// configs
	configs.EchoValidator(e)
	configs.LoadEnv()

	// middlewares
	middlewares.EchoMiddleware(e)

	// routes
	routes.PublicRoutes(e)
	routes.SwaggerRoute(e)
	routes.NotFoundRoute(e)

	e.Logger.Fatal(e.Start(":8080"))
}
