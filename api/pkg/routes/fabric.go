package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateFabricRoutes(g *echo.Group) {
	route := g.Group("/fabrics")

	fabricController := controllers.FabricController{FabricRepository: &services.FabricService{}}

	route.GET("", fabricController.ReadFabrics)
	route.GET("/aggregate", fabricController.AggregateFabrics)
	route.POST("", fabricController.CreateFabric)
	route.GET("/:fabricId", fabricController.ReadFabric)
	route.PATCH("/:fabricId", fabricController.UpdateFabric)
}
