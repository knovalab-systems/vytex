package middlewares

import (
	"log"

	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func EchoMiddlewares(e *echo.Echo) {
	// Create route group
	e.Use(
		middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
			LogStatus:  true,
			LogMethod:  true,
			LogLatency: true,
			LogURIPath: true,
			LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
				log.Printf("%v %v path: %v %v\n", v.Status, v.Method, v.URIPath, v.Latency)
				return nil
			}}),
		middleware.Recover(),
		middleware.CORSWithConfig(middleware.CORSConfig{
			AllowOrigins:     envs.Origins(),
			AllowCredentials: true,
			AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderCookie, echo.HeaderAuthorization},
			AllowMethods:     []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE, echo.OPTIONS}}))
}
