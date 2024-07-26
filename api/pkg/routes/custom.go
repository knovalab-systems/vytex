package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateCustomRoutes(g *echo.Group) {
	route := g.Group("/customs")

	customController := controllers.CustomController{CustomRepository: &services.CustomService{}}

	route.GET("", customController.ReadCustoms)
	route.GET("/aggregate", customController.AggregateCustoms)
	route.POST("", customController.CreateCustom)
	route.GET("/:customId", customController.ReadCustom)

}
