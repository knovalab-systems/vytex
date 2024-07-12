package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateUserRoutes(g *echo.Group) {
	route := g.Group("/users")

	userController := controllers.UserController{UserRepository: &services.UserService{}}

	route.GET("", userController.ReadUsers)
	route.POST("", userController.CreateUser)
	route.GET("/me", userController.ReadMe)
	route.GET("/aggregate", userController.AggregateUsers)
	route.GET("/:userId", userController.ReadUser)
	route.PATCH("/:userId", userController.UpdateUser)

}
