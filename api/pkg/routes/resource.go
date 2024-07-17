package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateResourceRoutes(g *echo.Group) {
	route := g.Group("/resources")

	resourceController := controllers.ResourceController{ResourceRepository: &services.ResourceService{}}

	route.GET("", resourceController.ReadResources)
	route.GET("/aggregate", resourceController.AggregateResources)
	route.POST("", resourceController.CreateResource)
}
