package models

import "github.com/golang-jwt/jwt/v5"

// Struct to describe login user
type LoginUser struct {
	UserName string `json:"username" validate:"required,lte=120,lowercase"`
	Password string `json:"password" validate:"required,lte=120,gte=8"`
}

type JWTClaims struct {
	UserName string `json:"username"`
	jwt.RegisteredClaims
}
