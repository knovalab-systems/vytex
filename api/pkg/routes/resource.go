package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateResourceRoutes(g *echo.Group) {
	route := g.Group("/resources")

	resourceController := controllers.ResourceController{ResourceRepository: &services.ResourceService{}}

	route.GET("", resourceController.ReadResources, middlewares.Policies([]models.Policie{models.ReadResources, models.CreateReferences, models.UpdateReferences}))
	route.GET("/aggregate", resourceController.AggregateResources, middlewares.Policies([]models.Policie{models.ReadReferences}))
	route.POST("", resourceController.CreateResource, middlewares.Policies([]models.Policie{models.CreateResources}))
	route.GET("/:resourceId", resourceController.ReadResource, middlewares.Policies([]models.Policie{models.ReadResources, models.UpdateResources}))
	route.PATCH("/:resourceId", resourceController.UpdateResource, middlewares.Policies([]models.Policie{models.UpdateResources}))
}
