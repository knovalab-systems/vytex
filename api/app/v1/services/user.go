package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gen/field"
	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) ReadUsers(q *models.Query) ([]*models.User, error) {
	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.UsersBadRequest()
	}

	// def query
	table := query.User
	s := table.Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = userFields(s, q.Fields)

	// filters
	filter, err := userFilters(q.Filter, s)
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	// run query
	users, err := filter.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	for _, item := range users {
		item.Password = ""
	}

	return users, nil
}

func (m *UserService) ReadUser(q *models.ReadUser) (*models.User, error) {
	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.UsersBadRequest()
	}

	// def query
	table := query.User
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = userFields(s, q.Fields)

	// filters
	filter, err := userFilters(q.Filter, s)
	if err != nil {
		return nil, problems.UsersBadRequest()
	}

	// run query
	user, err := filter.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	user.Password = ""

	return user, nil
}

func (m *UserService) AggregationUsers(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.User
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		countArr := strings.Split(q.Count, ",")
		countObj := make(map[string]int64)

		filter, err := userFilters(q.Filter, s)
		if err != nil {
			return nil, problems.ServerError()
		}

		for _, v := range countArr {
			switch v {
			case "id":
				count, err := filter.Select(table.ID).Count()
				if err != nil {
					return nil, problems.ServerError()
				}
				countObj["id"] = count
			default:

				if aggregateElem.Count == nil {
					count, err := filter.Count()
					if err != nil {
						return nil, problems.ServerError()
					}
					aggregateElem.Count = count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil
}

func (m *UserService) UpdateUser(u *models.UpdateUserBody) (*models.User, error) {
	table := query.User

	if u.Username != nil {
		err := checkUsername(*u.Username)
		if err != nil {
			return nil, err
		}
	}

	updateMap, err := u.ToUpdate()
	if err != nil || len(updateMap) == 0 {
		return nil, problems.UpdateUserBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(u.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	user, err := table.Unscoped().Where(table.ID.Eq(u.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	user.Password = "********"

	return user, nil
}

func (m *UserService) CreateUser(u *models.UserCreateBody) (*models.User, error) {
	// check user existence
	err := checkUsername(u.Username)
	if err != nil {
		return nil, err
	}

	// encrypt password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, problems.ServerError()
	}

	user := &models.User{
		Username: u.Username,
		Name:     u.Name,
		Password: string(hashedPassword),
		Role:     u.Role,
	}

	err = query.User.Create(user)
	if err != nil {
		return nil, problems.ServerError()
	}

	user.Password = "********"

	return user, nil
}

func checkUsername(username string) error {
	table := query.User

	_, err := table.Unscoped().Where(table.Username.Eq(username)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.UserExists()
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
		case "deleted_at":
			userFilter.DeletedAt = fmt.Sprintf("%v", value["_eq"])
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

	if userFilter.DeletedAt != "" {
		value, err := strconv.ParseBool(userFilter.DeletedAt)
		if err != nil {
			return nil, err
		}
		if value {
			condition := table.DeletedAt.IsNull()
			s = s.Where(condition)
		} else {
			condition := table.DeletedAt.IsNotNull()
			s = s.Where(condition)
		}
	}

	return s, nil
}

func userFields(s query.IUserDo, fields string) query.IUserDo {
	if fields != "" {
		table := query.User
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {
			switch v {
			case "id":
				f = append(f, table.ID)
			case "username":
				f = append(f, table.Username)
			case "name":
				f = append(f, table.Name)
			case "password":
				f = append(f, table.Password)
			case "role":
				f = append(f, table.Role)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "updated_at":
				f = append(f, table.UpdatedAt)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}
