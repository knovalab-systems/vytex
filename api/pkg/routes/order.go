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

	route.GET("", orderController.ReadOrders, middlewares.Policies([]models.Policy{models.ReadOrders}))
	route.GET("/aggregate", orderController.AggregateOrders, middlewares.Policies([]models.Policy{models.ReadOrders}))
	route.POST("", orderController.CreateOrder, middlewares.Policies([]models.Policy{models.CreateOrders}))
	route.GET("/:orderId", orderController.ReadOrder, middlewares.Policies([]models.Policy{models.ReadOrders, models.StartOrder}))
	route.PATCH("/:orderId", orderController.UpdateOrder, middlewares.Policies([]models.Policy{models.StartOrder}))

}
