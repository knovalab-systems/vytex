package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateTaskControlRoutes(g *echo.Group) {
	route := g.Group("/task-controls")

	taskControlController := controllers.TaskControlController{TaskControlRepository: &services.TaskControlService{}}

	route.GET("", taskControlController.ReadTaskControls, middlewares.Policies([]models.Policy{models.ReadCorte}))
}
