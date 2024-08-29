package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateReferenceRoutes(g *echo.Group) {
	route := g.Group("/references")

	resourceController := controllers.ReferenceController{ReferenceRepository: &services.ReferenceService{}}

	route.GET("", resourceController.ReadReferences, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.GET("/aggregate", resourceController.AggregateReferences, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.POST("", resourceController.CreateReference, middlewares.Policies(models.AllowRoles{Desinger: true}))

}
