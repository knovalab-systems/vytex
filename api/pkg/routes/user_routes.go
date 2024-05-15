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
	route.GET("/role/", userController.ReadUsersByRole)
	route.GET("/disabled", userController.ReadDisabledUsers)
	route.GET("/enabled", userController.ReadEnabledUsers)
	route.GET("/enabled/", userController.ReadEnabledUsers)
	route.GET("/aggregate", userController.AggregateUsers)
	route.GET("/aggregate/", userController.AggregateUsers)

}
