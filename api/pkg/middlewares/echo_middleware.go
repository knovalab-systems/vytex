package middlewares

import (
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func EchoMiddleware(e *echo.Echo) {
	// Create route group
	e.Use(
		middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
			LogStatus: true,
			LogURI:    true,
			LogMethod: true,
			LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
				log.Printf("%v %v, uri: %v \n", v.Method, v.Status, v.URI)
				return nil
			}}),
		middleware.Recover(),
		middleware.CORS(),
	)
}
