package middlewares

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/utils"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

func JwtMiddleware(r *echo.Group) {
	secret := os.Getenv("JWT_ACCESS_KEY")
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(utils.JWTClaims)
		},
		SigningKey: []byte(secret),
		ErrorHandler: func(c echo.Context, err error) error {
			if err != nil {
				return problems.JWTUnauthorized()
			}
			return nil
		},
	}

	r.Use(echojwt.WithConfig(config))

}
