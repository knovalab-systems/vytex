package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) SelectUsers(req *models.Request) ([]*models.User, error) {
	table := query.User
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Find()
	return users, err
}

func (m *UserService) AggregationUsers(req *models.AggregateRequest) ([]*models.AggregateData, error) {

	table := query.User
	aggregate := &models.AggregateData{}

	if req.Count != "" {
		count, err := table.Count()
		if err != nil {
			return nil, err
		}
		aggregate.Count = count
	}

	return []*models.AggregateData{aggregate}, nil
}

func (m *UserService) SelectUserByName(req *models.Request, name string) ([]*models.User, error) {
	table := query.User
	condition := table.Name.Lower().Like("%" + name + "%")
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Where(condition).Find()
	return users, err
}

func (m *UserService) SelectUserByUsername(req *models.Request, username string) ([]*models.User, error) {
	table := query.User
	condition := table.Username.Lower().Like("%" + username + "%")
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Where(condition).Find()
	return users, err
}

func (m *UserService) SelectDisabledUsers(req *models.Request) ([]*models.User, error) {
	table := query.User
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Where(query.User.DeleteAt.IsNotNull()).Find()
	return users, err
}

func (m *UserService) SelectEnabledUsers(req *models.Request) ([]*models.User, error) {
	table := query.User
	users, err := table.Unscoped().Limit(req.Limit).Offset(req.Offset).Where(query.User.DeleteAt.IsNull()).Find()
	return users, err
}
