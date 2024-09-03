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

	route.GET("", referenceController.ReadReferences, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true, ProSupervisor: true}))
	route.POST("", referenceController.CreateReference, middlewares.Policies(models.AllowRoles{Desinger: true}))
	route.GET("/aggregate", referenceController.AggregateReferences, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true, ProSupervisor: true}))
	route.GET("/:referenceId", referenceController.ReadReference, middlewares.Policies(models.AllowRoles{ProSupervisor: true, Admin: true, Desinger: true}))
	route.PATCH("/time-by-task/:referenceId", referenceController.UpdateTimesReference, middlewares.Policies(models.AllowRoles{ProSupervisor: true}))
}
