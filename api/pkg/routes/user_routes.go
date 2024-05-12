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
	route.GET("/name", userController.ReadUsersByName)
	route.GET("/name/", userController.ReadUsersByName)
	route.GET("/username", userController.ReadUsersByUsername)
	route.GET("/username/", userController.ReadUsersByUsername)
	route.GET("/disabled", userController.ReadDisableUsers)
	route.GET("/enabled", userController.ReadEnableUsers)
	route.GET("/enabled/", userController.ReadEnableUsers)
	route.GET("/aggregate", userController.AggregateUsers)
	route.GET("/aggregate/", userController.AggregateUsers)

}
