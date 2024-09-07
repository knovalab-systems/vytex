package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateFabricRoutes(g *echo.Group) {
	route := g.Group("/fabrics")

	fabricController := controllers.FabricController{FabricRepository: &services.FabricService{}}

	route.GET("", fabricController.ReadFabrics, middlewares.Policies([]models.Policie{models.ReadFabrics, models.CreateReferences, models.UpdateReferences}))
	route.GET("/aggregate", fabricController.AggregateFabrics, middlewares.Policies([]models.Policie{models.ReadFabrics}))
	route.POST("", fabricController.CreateFabric, middlewares.Policies([]models.Policie{models.UpdateFabrics}))
	route.GET("/:fabricId", fabricController.ReadFabric, middlewares.Policies([]models.Policie{models.ReadFabrics}))
	route.PATCH("/:fabricId", fabricController.UpdateFabric, middlewares.Policies([]models.Policie{models.UpdateFabrics}))
}
