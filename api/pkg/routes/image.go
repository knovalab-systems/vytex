package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateImageRoute(g *echo.Group) {
	route := g.Group("/images")

	imageController := controllers.ImageController{ImageRepository: &services.ImageService{}}

	route.POST("", imageController.CreateImage, middlewares.Policies(models.AllowRoles{Desinger: true, Admin: true}))
}
