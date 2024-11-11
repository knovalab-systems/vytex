package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateTaskControlStateRoutes(g *echo.Group) {
	route := g.Group("/task-control-status")

	taskControlStateController := controllers.TaskControlStateController{TaskControlStateRepository: &services.TaskControlStateService{}}

	route.GET("", taskControlStateController.ReadTaskControlStatus, middlewares.Policies([]models.Policy{models.ReadOrders, models.ReadCorte, models.ReadConfeccion, models.ReadCalidad, models.ReadEmpaque}))
}
