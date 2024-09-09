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

	route.GET("", userController.ReadUsers, middlewares.Policies([]models.Policy{models.ReadUsers}))
	route.POST("", userController.CreateUser, middlewares.Policies([]models.Policy{models.CreateUsers}))
	route.GET("/me", userController.ReadMe)
	route.GET("/aggregate", userController.AggregateUsers, middlewares.Policies([]models.Policy{models.ReadUsers}))
	route.GET("/:userId", userController.ReadUser, middlewares.Policies([]models.Policy{models.ReadUsers, models.UpdateUsers}))
	route.PATCH("/:userId", userController.UpdateUser, middlewares.Policies([]models.Policy{models.UpdateUsers}))
}
