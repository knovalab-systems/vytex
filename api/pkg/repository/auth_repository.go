package repository

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
)

type AuthRepository interface {
	RegisterRefresh(string, string) error
	ValidRefresh(string) (*models.Session, error)
	UserForLogin(string) (*models.User, error)
	DeleteRefresh(int) error
}
