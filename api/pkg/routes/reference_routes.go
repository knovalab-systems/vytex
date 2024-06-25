package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateReferenceRoutes(g *echo.Group) {
	route := g.Group("/references")

	resourceController := controllers.ReferenceController{ReferenceRepository: &services.ReferenceService{}}

	route.POST("", resourceController.CreateReference)

}