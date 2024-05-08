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

func (m *UserQuery) SelectUserByName(name string) ([]*models.User, error) {
	table := genquery.User
	condition := genquery.User.Name.Lower().Like("%" + name + "%")
	users, err := table.Unscoped().Where(condition).Find()
	return users, err
}

func (m *UserQuery) SelectUserByUsername(username string) ([]*models.User, error) {
	table := genquery.User
	condition := genquery.User.Username.Lower().Like("%" + username + "%")
	users, err := table.Unscoped().Where(condition).Find()
	return users, err
}
