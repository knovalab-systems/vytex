package services

import (
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
	"github.com/knovalab-systems/vytex/pkg/utils"
)

type AuthService struct {
}

func (m *AuthService) UserForLogin(username string) (*models.User, error) {
	table := query.User
	user, err := table.Where(table.Username.Eq(username)).First()
	return user, err
}

func (m *AuthService) RegisterRefresh(userId string, token string) error {
	expire := time.Now().Add(utils.RefreshExpires)
	table := query.Session
	session := models.Session{UserID: userId, RefreshToken: token, ExpiresAt: expire}
	err := table.Create(&session)
	return err
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
