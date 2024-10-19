package helpers

import (
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
)

func GenerateTokens(user string, role string) (*models.Tokens, error) {
	// Generate JWT Access token.
	accessToken, err := generateAccessToken(user, role)
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	// Generate JWT Refresh token.
	refreshToken, err := generateRefreshToken()
	if err != nil {
		// Return token generation error.
		return nil, err
	}

	return &models.Tokens{
		Access:  accessToken,
		Refresh: refreshToken,
	}, nil
}

func generateAccessToken(user string, role string) (string, error) {
	// env access key
	secret := envs.JWT_ACCESS_KEY()

	// create claims
	claims := &models.JWTClaims{
		User: user,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(models.AccessExpires)),
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
func generateRefreshToken() (string, error) {
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
	expireTime := time.Now().Add(models.RefreshExpires).String()

	// Create a new refresh token (sha256 string with salt + expire time).
	t := hex.EncodeToString(hash.Sum(nil)) + "." + expireTime

	return t, nil
}
