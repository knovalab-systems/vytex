package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Types for tokens
type Tokens struct {
	Access           string
	Refresh          string
	RefreshExpiresAt time.Time
}

type JWTClaims struct {
	User string `json:"user"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

const AccessExpires time.Duration = time.Minute * 15
const RefreshExpires time.Duration = time.Hour * 168
const RefreshCookieName = "vytex_refresh_token"
