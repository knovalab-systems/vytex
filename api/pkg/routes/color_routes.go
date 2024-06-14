package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateColorRoutes(g *echo.Group) {
	route := g.Group("/colors")

	colorController := controllers.ColorController{ColorRepository: &services.ColorService{}}

	route.GET("", colorController.ReadColors)

}
