package routes

import (
	_ "github.com/knovalab-systems/vytex/docs"
	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// Routes for swagger
func SwaggerRoutes(e *echo.Echo) {
	route := e.Group("/swagger")

	route.GET("*", echoSwagger.WrapHandler)
}
