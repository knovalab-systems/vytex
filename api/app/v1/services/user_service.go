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
	filter, err := userFilters(q.Filter, s)
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	users, err := filter.Find()
	if err != nil {
		return nil, problems.ServerError()
	}
	return users, nil
}

func (m *UserService) AggregationUsers(q *models.AggregateQuery) ([]*models.AggregateData, error) {

	table := query.User
	aggregate := &models.AggregateData{}

	if q.Count != "" {
		s := table.Unscoped()
		filter, err := userFilters(q.Filter, s)
		if err != nil {
			return nil, problems.ServerError()
		}
		count, err := filter.Count()
		if err != nil {
			return nil, problems.ServerError()
		}
		aggregate.Count = count
	}

	return []*models.AggregateData{aggregate}, nil
}

func userFilters(u string, s query.IUserDo) (query.IUserDo, error) {

	if u == "" {
		return s, nil
	}

	table := query.User
	var result map[string]map[string]interface{}
	err := json.Unmarshal([]byte(u), &result)
	if err != nil {
		return nil, err
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

	if userFilter.Name != "" {
		condition := table.Name.Lower().Like("%" + userFilter.Name + "%")
		s = s.Where(condition)
	}

	if userFilter.Username != "" {
		condition := table.Username.Lower().Like("%" + userFilter.Username + "%")
		s = s.Where(condition)
	}

	if userFilter.Role != "" {
		condition := table.Role.Eq(userFilter.Role)
		s = s.Where(condition)
	}

	if userFilter.DeleteAt != "" {
		value, err := strconv.ParseBool(userFilter.DeleteAt)
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

	return s, nil
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

func (m *UserService) CreateUser(u *models.CreateUserBody) (*models.User, error) {
	table := query.User

	_, err := u.Validate()

	if err != nil {
		return nil, problems.CreateUsersBadRequest()
	}

	user := &models.User{
		Username: u.Username,
		Name:     u.Name,
		Password: u.Password,
		Role:     *u.Role,
	}

	err = table.Create(user)
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}

func (m *UserService) CheckUserExistence(username string) (bool, error) {
	table := query.User

	count, err := table.Where(table.Username.Eq(username)).Count()
	if err != nil {
		return false, problems.ServerError()
	}

	return count > 0, nil
}
