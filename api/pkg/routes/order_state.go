package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateOrderStateRoutes(g *echo.Group) {
	route := g.Group("/order-status")

	orderStateController := controllers.OrderStateController{OrderStateRepository: &services.OrderStateService{}}
	route.GET("/aggregate", orderStateController.AggregateOrderState, middlewares.Policies([]models.Policy{models.ReadOrderStatus, models.ReadOrders}))
	route.GET("", orderStateController.ReadOrderStatus, middlewares.Policies([]models.Policy{models.ReadOrders}))
}
