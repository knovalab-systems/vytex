package repository

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/utils"
)

type AuthRepository interface {
	Credentials(string, string) (*utils.Tokens, error)
	DeleteRefresh(int) error
	ValidRefresh(string) (*models.SessionWithRole, error)
	ValidUser(string, string) (*models.User, error)
}
