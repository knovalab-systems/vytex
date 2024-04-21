package routes

import (
	_ "github.com/knovalab-systems/vytex/docs"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func SwaggerRoute(a *echo.Echo) {
	// Create route group
	route := a.Group("/swagger")

	route.GET("*", echoSwagger.WrapHandler)
}
