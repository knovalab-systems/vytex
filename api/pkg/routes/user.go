package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateUserRoutes(g *echo.Group) {
	route := g.Group("/users")

	userController := controllers.UserController{UserRepository: &services.UserService{}}

	route.GET("", userController.ReadUsers, middlewares.Policies([]models.Policie{models.ReadUsers}))
	route.POST("", userController.CreateUser, middlewares.Policies([]models.Policie{models.CreateUsers}))
	route.GET("/me", userController.ReadMe)
	route.GET("/aggregate", userController.AggregateUsers, middlewares.Policies([]models.Policie{models.ReadUsers}))
	route.GET("/:userId", userController.ReadUser, middlewares.Policies([]models.Policie{models.ReadUsers, models.UpdateUsers}))
	route.PATCH("/:userId", userController.UpdateUser, middlewares.Policies([]models.Policie{models.UpdateUsers}))
}
