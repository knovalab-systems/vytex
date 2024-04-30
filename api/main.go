package main

import (
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/gen"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/knovalab-systems/vytex/pkg/routes"
	"github.com/knovalab-systems/vytex/platform/database"
	"github.com/labstack/echo/v4"
)

// @title Vytex API
// @version 0.0
// @BasePath /api/v1
// @accept json
func main() {
	e := echo.New()

	// configs
	config.EchoValidator(e)
	config.LoadEnv()

	// middlewares
	middlewares.EchoMiddleware(e)

	// database
	db := database.Db("")
	gen.SetDefault(db)
	// db.Create(&models.User{UserName: "jose", Password: "12345678"})

	// routes
	routes.SwaggerRoute(e)
	routes.PublicRoutes(e)
	routes.PrivateRoutes(e)
	routes.NotFoundRoute(e)

	e.Logger.Fatal(e.Start(":8080"))
}
