package models

import (
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/pkg/envs"
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

type JwtTokens struct {
}

const AccessExpires time.Duration = time.Minute * 15
const RefreshExpires time.Duration = time.Hour * 168
const RefreshCookieName = "vytex_refresh_token"

func GenerateTokens(user string, role string) (*Tokens, error) {
	// Generate JWT Access token.
	accessToken, err := GenerateAccessToken(user, role)
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	// Generate JWT Refresh token.
	refreshToken, err := GenerateRefreshToken()
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	return &Tokens{
		Access:  accessToken,
		Refresh: refreshToken,
	}, nil
}

func GenerateAccessToken(user string, role string) (string, error) {
	// env access key
	secret := envs.JWT_ACCESS_KEY()

	// create claims
	claims := &JWTClaims{
		User: user,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(AccessExpires)),
		},
	}

	// Create a new JWT access token with claims.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate token.
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return t, nil

}

// this should be diff
func GenerateRefreshToken() (string, error) {
	// Create a new SHA256 hash.
	hash := sha256.New()

	// env refresh key
	secret := envs.JWT_REFRESH_KEY() + time.Now().String()

	// See: https://pkg.go.dev/io#Writer.Write
	_, err := hash.Write([]byte(secret))
	if err != nil {
		// Return error, it refresh token generation failed.
		return "", err
	}

	// Set expiration time.
	expireTime := time.Now().Add(RefreshExpires).String()

	// Create a new refresh token (sha256 string with salt + expire time).
	t := hex.EncodeToString(hash.Sum(nil)) + "." + expireTime

	return t, nil

}
