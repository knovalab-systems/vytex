package services

import (
	"encoding/json"
	"fmt"
	"strconv"

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
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)
	filter, err := userFilters(q)
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	if filter.Name != "" {
		condition := table.Name.Lower().Like("%" + filter.Name + "%")
		s = s.Where(condition)
	}

	if filter.Username != "" {
		condition := table.Username.Lower().Like("%" + filter.Username + "%")
		s = s.Where(condition)
	}

	if filter.Role != "" {
		condition := table.Role.Eq(filter.Role)
		s = s.Where(condition)
	}

	if filter.DeleteAt != "" {
		value, err := strconv.ParseBool(filter.DeleteAt)
		if err != nil {
			return nil, err
		}
		if value {
			condition := table.DeleteAt.IsNull()
			s = s.Where(condition)
		} else {
			condition := table.DeleteAt.IsNotNull()
			s = s.Where(condition)
		}
	}

	users, err := s.Find()
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

func userFilters(u *models.Query) (models.UserFilter, error) {
	var result map[string]map[string]interface{}
	err := json.Unmarshal([]byte(u.Filter), &result)
	if err != nil {
		return models.UserFilter{}, err
	}

	var userFilter models.UserFilter
	for key, value := range result {
		switch key {
		case "username":
			userFilter.Username = value["_eq"].(string)
		case "name":
			userFilter.Name = value["_eq"].(string)
		case "role":
			userFilter.Role = fmt.Sprintf("%v", value["_eq"])
		case "delete_at":
			userFilter.DeleteAt = fmt.Sprintf("%v", value["_eq"])
		}
	}

	return userFilter, nil
}

func (m *UserService) SelectUsersByFilter(filter *models.UserFilter, req *models.Query) ([]*models.User, error) {
	table := query.User
	queries := table.Unscoped().Limit(*req.Limit).Offset(req.Offset)

	if filter.Name != "" {
		condition := table.Name.Lower().Like("%" + filter.Name + "%")
		queries = queries.Where(condition)
	}

	if filter.Username != "" {
		condition := table.Username.Lower().Like("%" + filter.Username + "%")
		queries = queries.Where(condition)
	}

	if filter.Role != "" {
		condition := table.Role.Eq(filter.Role)
		queries = queries.Where(condition)
	}

	if filter.DeleteAt != "" {
		value, err := strconv.ParseBool(filter.DeleteAt)
		if err != nil {
			return nil, err
		}
		if value {
			condition := table.DeleteAt.IsNull()
			queries = queries.Where(condition)
		} else {
			condition := table.DeleteAt.IsNotNull()
			queries = queries.Where(condition)
		}
	}

	return queries.Find()
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
