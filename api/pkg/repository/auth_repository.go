package repository

import (
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

type AuthRepository interface {
	RegisterRefresh(string, string, time.Time) error
	ValidRefresh(string) (*models.Session, error)
	UserForLogin(string) (*models.User, error)
	DeleteRefresh(int) error
}
