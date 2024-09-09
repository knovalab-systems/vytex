package middlewares

import (
	"slices"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"github.com/labstack/echo/v4"
)

func Policies(policies []models.Policy) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			// get user from jwt
			userJWT := c.Get("user").(*jwt.Token)
			claims := userJWT.Claims.(*models.JWTClaims)

			// get role policies
			table := query.Role
			role, err := table.Where(table.ID.Eq(claims.Role)).First()
			if err != nil {
				return problems.ServerError()
			}

			// valid policy exists in role
			for _, v := range policies {
				present := slices.Contains(role.Policies, (int64)(v))
				if present {
					return next(c)
				}
			}

			return problems.ReadAccess()
		}
	}
}
