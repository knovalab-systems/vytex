package services

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/golang-jwt/jwt/v5"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type AuthService struct {
}

func (m *AuthService) ValidUser(username string, password string) (*models.User, error) {

	table := query.User
	user, err := table.Session(&gorm.Session{SkipHooks: true}).Where(table.Username.Eq(username)).First()
	if err != nil {
		return nil, err
	}

	// Compare the password with the hashed password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("INVALID CREDENTIALS")
	}

	return user, nil
}

func (m *AuthService) Credentials(user string, role string) (*models.Tokens, error) {
	// get tokens
	tokens, err := generateTokens(user, role)
	if err != nil {
		return nil, err
	}
	tokens.RefreshExpiresAt = time.Now().Add(models.RefreshExpires)

	// create session
	table := query.Session
	session := models.Session{UserID: user, RefreshToken: tokens.Refresh, ExpiresAt: tokens.RefreshExpiresAt}
	err = table.Create(&session)

	return tokens, err
}

func (m *AuthService) ValidRefresh(token string) (*models.Session, error) {

	s := query.Session

	session, err := s.Preload(s.User).Where(s.RefreshToken.Eq(token)).Where(s.ExpiresAt.Gt(time.Now())).First()
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (m *AuthService) DeleteRefresh(id int) error {
	table := query.Session
	_, err := table.Where(table.ID.Eq(id)).Delete()
	return err
}

func generateTokens(user string, role string) (*models.Tokens, error) {
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
