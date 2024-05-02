package routes

import (
	"github.com/knovalab-systems/vytex/app/v1/controllers"
	"github.com/knovalab-systems/vytex/app/v1/queries"
	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/labstack/echo/v4"
)

func publicAuthRoutes(r *echo.Group) {

	authController := controllers.AuthController{AuthRepository: &queries.AuthQuery{}, TokensRepository: &utils.JwtTokends{}}

	r.POST("/login", authController.Login)
	r.POST("/refresh", authController.Refresh)
	r.POST("/logout", authController.Logout)

}
