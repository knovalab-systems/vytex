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

	referenceController := controllers.ReferenceController{ReferenceRepository: &services.ReferenceService{}}

	route.GET("", referenceController.ReadReferences, middlewares.Policies([]models.Policy{models.ReadReferences, models.CreateCustoms, models.UpdateCustoms, models.CreateOrders}))
	route.POST("", referenceController.CreateReference, middlewares.Policies([]models.Policy{models.CreateReferences}))
	route.GET("/aggregate", referenceController.AggregateReferences, middlewares.Policies([]models.Policy{models.ReadReferences}))
	route.GET("/:referenceId", referenceController.ReadReference, middlewares.Policies([]models.Policy{models.ReadReferences, models.UpdateTimesReferences}))
	route.GET("/images/:referenceId", referenceController.ReadReferenceImages, middlewares.Policies([]models.Policy{models.ReadReferences}))
	route.PATCH("/time-by-task/:referenceId", referenceController.UpdateTimesReference, middlewares.Policies([]models.Policy{models.UpdateTimesReferences}))
}
