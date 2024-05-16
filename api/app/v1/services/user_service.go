package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) SelectUsers(q *models.Query) ([]*models.User, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.UsersBadRequest()
	}

	table := query.User
	users, err := table.Unscoped().Limit(*q.Limit).Offset(q.Offset).Find()
	if err != nil {
		return nil, problems.ServerError()
	}
	return users, nil
}

func (m *UserService) AggregationUsers(q *models.AggregateQuery) ([]*models.AggregateData, error) {

	table := query.User
	aggregate := &models.AggregateData{}

	if q.Count != "" {
		count, err := table.Count()
		if err != nil {
			return nil, problems.ServerError()
		}
		aggregate.Count = count
	}

	return []*models.AggregateData{aggregate}, nil
}

func (m *UserService) UpdateUser(update *models.UpdateUserBody) (*models.User, error) {
	table := query.User

	updateMap, err := update.ToUpdate()
	if err != nil || len(updateMap) == 0 {
		return nil, problems.UpdateUsersBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(update.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.UpdateUsersBadRequest()
	}

	user, err := table.Unscoped().Where(table.ID.Eq(update.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}
