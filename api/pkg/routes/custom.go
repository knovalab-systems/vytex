package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateCustomRoutes(g *echo.Group) {
	route := g.Group("/customs")

	colorController := controllers.CustomController{CustomRepository: &services.CustomService{}}

	route.GET("", colorController.ReadCustoms)
	route.GET("/aggregate", colorController.AggregateCustoms)
	route.POST("", colorController.CreateCustom)

}
