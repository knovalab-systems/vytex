package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) SelectUsers(req *models.Query) ([]*models.User, error) {
	table := query.User
	users, err := table.Unscoped().Limit(*req.Limit).Offset(req.Offset).Find()
	return users, err
}

func (m *UserService) AggregationUsers(req *models.AggregateQuery) ([]*models.AggregateData, error) {

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
