package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateImageRoute(g *echo.Group) {
	route := g.Group("/files")

	imageController := controllers.ImageController{ImageRepository: &services.ImageService{}}

	route.POST("", imageController.CreateImage)
}
