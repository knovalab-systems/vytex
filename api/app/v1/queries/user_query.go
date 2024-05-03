package queries

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/gen"
)

type UserQuery struct {
}

func (m *UserQuery) SelectUsers(req *models.Request) ([]*models.User, error) {
	table := gen.User
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Find()

	return users, err
}
