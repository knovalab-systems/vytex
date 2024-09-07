package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateOrderRoutes(g *echo.Group) {
	route := g.Group("/orders")

	orderController := controllers.OrderController{OrderRepository: &services.OrderService{}}

	route.GET("", orderController.ReadOrders, middlewares.Policies([]models.Policie{models.ReadOrders}))
	route.GET("/aggregate", orderController.AggregateOrders, middlewares.Policies([]models.Policie{models.ReadOrders}))
	route.POST("", orderController.CreateOrder, middlewares.Policies([]models.Policie{models.CreateOrders}))
}
