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

	route.GET("", colorController.ReadColors, middlewares.Policies([]models.Policie{models.ReadColors, models.CreateFabrics, models.UpdateFabrics, models.CreateResources, models.UpdateResources, models.CreateReferences, models.UpdateReferences}))
	route.POST("", colorController.CreateColor, middlewares.Policies([]models.Policie{models.CreateColors}))
	route.GET("/aggregate", colorController.AggregateColors, middlewares.Policies([]models.Policie{models.ReadColors}))
	route.GET("/:colorId", colorController.ReadColor, middlewares.Policies([]models.Policie{models.ReadColors, models.UpdateColors}))
	route.PATCH("/:colorId", colorController.UpdateColor, middlewares.Policies([]models.Policie{models.UpdateColors}))
}
