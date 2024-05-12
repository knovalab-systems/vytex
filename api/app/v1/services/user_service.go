package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
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

func (m *UserService) UpdateUser(update *models.UpdateUserBody) (*models.User, error) {
	table := query.User

	updateMap, err := update.ToUpdate()
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	rows, err := table.Where(table.ID.Eq(update.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}
	if rows.RowsAffected == 0 {
		return nil, problems.UsersBadRequest()
	}

	user, err := table.Where(table.ID.Eq(update.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}
