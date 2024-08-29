package middlewares

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
)

func Policies(roles models.AllowRoles) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			// get user from jwt
			userJWT := c.Get("user").(*jwt.Token)
			claims := userJWT.Claims.(*models.JWTClaims)

			if roles.Admin {
				role := envs.ADMIN_ROLE()
				if claims.Role == role {
					return next(c)
				}
			}

			if roles.Desinger {
				role := envs.DESIGNER_ROLE()
				if claims.Role == role {
					return next(c)
				}
			}

			if roles.ProSupervisor {
				role := envs.PRO_SUPERVISOR_ROLE()
				if claims.Role == role {
					return next(c)
				}
			}

			if roles.NoRole {
				role := envs.NO_ROLE()
				if claims.Role == role {
					return next(c)
				}
			}

			return problems.ReadAccess()
		}
	}
}
