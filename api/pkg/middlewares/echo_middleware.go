package middlewares

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func EchoMiddleware(a *echo.Echo) {
	// Create route group
	a.Use(
		middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
			LogStatus: true,
			LogURI:    true,
			LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
				log.Printf("status: %v, uri: %v \n", v.Status, v.URI)
				return nil
			}}),
		middleware.Recover(),
		middleware.CORS(),
	)
}
