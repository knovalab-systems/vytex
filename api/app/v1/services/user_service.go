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

func (m *UserService) GetUserFilter(u *models.Request) (models.UserFilter, error) {
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

func (m *UserService) SelectUsersByFilter(filter *models.UserFilter, req *models.Request) ([]*models.User, error) {
	table := query.User
	queries := table.Unscoped().Limit(req.Limit).Offset(req.Offset)

	if filter.Name != "" {
		condition := table.Name.Lower().Like("%" + filter.Name + "%")
		queries = queries.Where(condition)
	}

	if filter.Username != "" {
		condition := table.Username.Lower().Like("%" + filter.Username + "%")
		queries = queries.Where(condition)
	}

	if filter.Role != "" {
		role, err := strconv.ParseInt(filter.Role, 10, 8)
		if err != nil {
			return nil, err
		}
		condition := table.Role.Eq(int8(role))
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
