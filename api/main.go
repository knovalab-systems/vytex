package main

import (
	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/knovalab-systems/vytex/pkg/query"
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
	middlewares.EchoMiddlewares(e)

	// database
	db := database.DB()
	query.SetDefault(db)

	// seed test data
	if envs.ENVIRONMENT() == "test" {
		database.SeedDB(db)
	}

	// routes
	routes.Routes(e)

	e.Logger.Fatal(e.Start(":8080"))
}
