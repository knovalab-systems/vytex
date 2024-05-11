package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/labstack/echo/v4"
)

func privateUsersRoutes(g *echo.Group) {
	route := g.Group("/users")

	userController := controllers.UserController{UserRepository: &services.UserService{}}

	route.GET("", userController.ReadUsers)
	route.GET("/", userController.ReadUsers)
	route.GET("/", userController.ReadUsersByName)
	route.GET("/", userController.ReadUsersByUsername)
	route.GET("/aggregate", userController.AggregateUsers)
	route.GET("/aggregate/", userController.AggregateUsers)

}
