package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateOrderRoutes(g *echo.Group) {
	route := g.Group("/orders")

	orderController := controllers.OrderController{OrderRepository: &services.OrderService{}}

	route.GET("", orderController.ReadOrders)
	route.GET("/aggregate", orderController.AggregateOrders)
	route.POST("", orderController.CreateOrder)
}
