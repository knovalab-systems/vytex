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

	route.GET("", fabricController.ReadFabrics, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.GET("/aggregate", fabricController.AggregateFabrics, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.POST("", fabricController.CreateFabric, middlewares.Policies(models.AllowRoles{Desinger: true}))
	route.GET("/:fabricId", fabricController.ReadFabric, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.PATCH("/:fabricId", fabricController.UpdateFabric, middlewares.Policies(models.AllowRoles{Desinger: true}))
}
