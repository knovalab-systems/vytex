package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateColorRoutes(g *echo.Group) {
	route := g.Group("/colors")

	colorController := controllers.ColorController{ColorRepository: &services.ColorService{}}

	route.GET("", colorController.ReadColors, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.POST("", colorController.CreateColor, middlewares.Policies(models.AllowRoles{Desinger: true}))
	route.GET("/aggregate", colorController.AggregateColors, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.GET("/:colorId", colorController.ReadColor, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
	route.PATCH("/:colorId", colorController.UpdateColor, middlewares.Policies(models.AllowRoles{Desinger: true}))
}
