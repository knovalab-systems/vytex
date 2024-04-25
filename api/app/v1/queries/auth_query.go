package queries

import (
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/gen"
)

func UserForLogin(userName string) (*models.User, error) {
	table := gen.User
	user, err := table.Where(table.UserName.Eq(userName)).First()
	return user, err
}

func RegisterRefresh(userId string, token string, expire time.Time) error {
	table := gen.Session
	session := models.Session{UserID: userId, RefreshToken: token, ExpiresAt: expire}
	err := table.Create(&session)
	return err
}

func ValidRefresh(userId string, token string) (*models.Session, error) {
	table := gen.Session
	session, err := table.Where(table.UserID.Eq(userId)).Where(table.RefreshToken.Eq(token)).Where(table.ExpiresAt.Gt(time.Now())).First()
	return session, err
}
