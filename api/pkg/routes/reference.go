package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateReferenceRoutes(g *echo.Group) {
	route := g.Group("/references")

	resourceController := controllers.ReferenceController{ReferenceRepository: &services.ReferenceService{}}

	route.GET("", resourceController.ReadReferences)
	route.GET("/aggregate", resourceController.AggregateReferences)
	route.POST("", resourceController.CreateReference)

}
