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

func (m *AuthService) Credentials(user string, role string) (*utils.Tokens, error) {
	// get tokens
	tokens, err := utils.GenerateTokens(user, role)
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

func (m *AuthService) ValidRefresh(token string) (*models.SessionWithRole, error) {

	s := query.Session
	u := query.User

	session := &models.SessionWithRole{}
	err := s.Select(s.ALL, u.Role).Where(s.RefreshToken.Eq(token)).Where(s.ExpiresAt.Gt(time.Now())).Join(u, u.ID.EqCol(s.UserID)).Scan(session)
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
