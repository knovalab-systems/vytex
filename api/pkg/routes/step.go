package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateStepRoutes(g *echo.Group) {
	route := g.Group("/steps")

	stepController := controllers.StepController{StepRepository: &services.StepService{}}

	route.GET("", stepController.ReadSteps, middlewares.Policies([]models.Policy{models.ReadCorte, models.ReadConfeccion}))
}
