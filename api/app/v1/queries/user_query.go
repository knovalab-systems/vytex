package queries

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/genquery"
)

type UserQuery struct {
}

func (m *UserQuery) SelectUsers(req *models.Request) ([]*models.User, error) {
	table := genquery.User
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Find()
	return users, err
}
