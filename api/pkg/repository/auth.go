package repository

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
)

type AuthRepository interface {
	Credentials(string, string) (*models.Tokens, error)
	DeleteRefresh(int) error
	ValidRefresh(string) (*models.Session, error)
	ValidUser(string, string) (*models.User, error)
}
