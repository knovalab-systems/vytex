package queries

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/gen"
)

type UserQuery struct {
}

func (m *UserQuery) SelectUsers() ([]*models.User, error) {
	table := gen.User
	users, err := table.Find()
	return users, err
}
