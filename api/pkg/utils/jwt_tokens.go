package utils

import (
	"crypto/sha256"
	"encoding/hex"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Types for tokens
type (
	JWTClaims struct {
		UserName string `json:"username"`
		jwt.RegisteredClaims
	}
	Tokens struct {
		Access  string
		Refresh string
	}
)

const AccessExpires time.Duration = time.Minute * 15
const RefreshExpires time.Duration = time.Hour * 720
const RefreshCookieName = "vytex_refresh_token"

func GenerateTokens(userName string) (*Tokens, error) {
	// Generate JWT Access token.
	accessToken, err := GenerateAccessToken(userName)
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	// Generate JWT Refresh token.
	refreshToken, err := GenerateRefreshToken(userName)
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	return &Tokens{
		Access:  accessToken,
		Refresh: refreshToken,
	}, nil
}

func GenerateAccessToken(username string) (string, error) {
	// env access key
	secret := os.Getenv("JWT_ACCESS_KEY")

	// create claims
	claims := &JWTClaims{
		UserName: username,
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
func GenerateRefreshToken(username string) (string, error) {
	// Create a new SHA256 hash.
	hash := sha256.New()

	// env refresh key
	secret := os.Getenv("JWT_REFRESH_KEY") + time.Now().String()

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
