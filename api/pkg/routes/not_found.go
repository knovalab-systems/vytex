package routes

import (
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
)

// Route for describe 404 Error not found route.
func notFoundRoute(e interface{}) {

	switch e := e.(type) {
	case *echo.Echo:
		e.RouteNotFound("*", func(c echo.Context) error {
			return problems.RouteNotFound()
		})
	case *echo.Group:
		e.RouteNotFound("*", func(c echo.Context) error {
			return problems.RouteNotFound()
		})
	}

}
