package services

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
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
	tokens, err := helpers.GenerateTokens(user, role)
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
