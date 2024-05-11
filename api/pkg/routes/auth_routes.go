package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/queries"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

func publicAuthRoutes(g *echo.Group) {
	route := g.Group("/auth")

	authController := controllers.AuthController{AuthRepository: &queries.AuthQuery{}, TokensRepository: &utils.JwtTokens{}}

	route.POST("/login", authController.Login)
	route.POST("/refresh", authController.Refresh)
	route.POST("/logout", authController.Logout)

}
