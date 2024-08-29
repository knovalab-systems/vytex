package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateCustomRoutes(g *echo.Group) {
	route := g.Group("/customs")

	customController := controllers.CustomController{CustomRepository: &services.CustomService{}}

	route.GET("", customController.ReadCustoms, middlewares.Policies(models.AllowRoles{Admin: true}))
	route.GET("/aggregate", customController.AggregateCustoms, middlewares.Policies(models.AllowRoles{Admin: true}))
	route.POST("", customController.CreateCustom, middlewares.Policies(models.AllowRoles{Admin: true}))
	route.GET("/:customId", customController.ReadCustom, middlewares.Policies(models.AllowRoles{Admin: true}))

}
