package services

import (
	"errors"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
	"github.com/knovalab-systems/vytex/pkg/utils"
)

type AuthService struct {
}

func (m *AuthService) ValidUser(username string, password string) (*models.User, error) {

	table := query.User
	user, err := table.Where(table.Username.Eq(username)).First()
	if err != nil {
		return nil, err
	}

	if user.Password != password { // pending to encrypt pass
		return nil, errors.New("INVALID CREDENTIALS")
	}
	return user, err
}

func (m *AuthService) Credentials(user string) (*utils.Tokens, error) {
	// get tokens
	tokens, err := utils.GenerateTokens(user)
	if err != nil {
		return nil, err
	}
	tokens.RefreshExpiresAt = time.Now().Add(utils.RefreshExpires)

	// create session
	table := query.Session
	session := models.Session{UserID: user, RefreshToken: tokens.Refresh, ExpiresAt: tokens.RefreshExpiresAt}
	err = table.Create(&session)

	return tokens, err
}

func (m *AuthService) ValidRefresh(token string) (*models.Session, error) {
	table := query.Session
	session, err := table.Where(table.RefreshToken.Eq(token)).Where(table.ExpiresAt.Gt(time.Now())).First()
	return session, err
}

func (m *AuthService) DeleteRefresh(id int) error {
	table := query.Session
	_, err := table.Where(table.ID.Eq(id)).Delete()
	return err
}
