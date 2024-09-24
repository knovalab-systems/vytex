package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/app/v1/services"
	"github.com/knovalab-systems/vytex/pkg/middlewares"
	"github.com/labstack/echo/v4"
)

func privateRoleRoutes(g *echo.Group) {
	route := g.Group("/roles")

	roleController := controllers.RoleController{RoleRepository: &services.RoleService{}}

	route.GET("", roleController.ReadRoles, middlewares.Policies([]models.Policy{models.ReadUsers, models.UpdateUsers, models.CreateUsers}))
	route.GET("/aggregate", roleController.AggregateRoles, middlewares.Policies([]models.Policy{models.ReadRoles}))

}
