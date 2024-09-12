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

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
)

type UserService struct {
}

func (m *UserService) SelectUsers(q *models.Query) ([]*models.User, error) {
	// sanitize
	formats.SanitizedQuery(q)

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
	users, err := filter.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return users, nil
}

func (m *UserService) SelectUser(q *models.UserRead) (*models.User, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

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

func (m *UserService) UpdateUser(b *models.UserUpdateBody) (*models.User, error) {
	table := query.User

	if b.Username != "" {
		err := checkUsername(b.Username)
		if err != nil {
			return nil, err
		}
	}

	updateMap, err := formats.UserUpdateMap(b)
	if err != nil || len(updateMap) == 0 {
		return nil, problems.UpdateUserBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	user, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return user, nil
}

func (m *UserService) CreateUser(b *models.UserCreateBody) (*models.User, error) {
	// check user existence
	err := checkUsername(b.Username)
	if err != nil {
		return nil, err
	}

	// encrypt password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(b.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, problems.ServerError()
	}

	user := &models.User{
		Username: b.Username,
		Name:     b.Name,
		Password: string(hashedPassword),
		RoleId:   b.Role,
	}

	err = query.User.Create(user)
	if err != nil {
		return nil, problems.ServerError()
	}

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
		condition := table.RoleId.Eq(userFilter.Role)
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

func userFields(s query.IUserDo, fieldsStr string) query.IUserDo {
	if fieldsStr != "" {
		userTable := query.User
		fieldsArr := strings.Split(fieldsStr, ",")
		fields := []field.Expr{}
		roleFieldsArr := []string{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "role.") {
				roleFieldsArr = append(roleFieldsArr, strings.ReplaceAll(v, "role.", ""))
				continue
			}

			switch v {
			case "id":
				fields = append(fields, userTable.ID)
			case "username":
				fields = append(fields, userTable.Username)
			case "name":
				fields = append(fields, userTable.Name)
			case "password":
				fields = append(fields, userTable.Password)
			case "roleId":
				fields = append(fields, userTable.RoleId)
			case "role":
				fields = append(fields, userTable.RoleId)
				s = s.Preload(userTable.Role)
			case "deleted_at":
				fields = append(fields, userTable.DeletedAt)
			case "created_at":
				fields = append(fields, userTable.CreatedAt)
			case "updated_at":
				fields = append(fields, userTable.UpdatedAt)
			default:
				fields = append(fields, userTable.ALL)
			}
		}

		if len(roleFieldsArr) != 0 {
			fields = append(fields, userTable.RoleId)
			roleTables := query.Role
			roleFields := []field.Expr{}

			for _, v := range roleFieldsArr {
				switch v {
				case "id":
					roleFields = append(roleFields, roleTables.ID)
				case "name":
					roleFields = append(roleFields, roleTables.Name)
				case "is_admin":
					roleFields = append(roleFields, roleTables.IsAdmin)
				case "policies":
					roleFields = append(roleFields, roleTables.Policies)
				default:
					roleFields = append(roleFields, roleTables.ALL)
				}
			}
			s = s.Preload(userTable.Role.Select(roleFields...))
		}
		s = s.Select(fields...)
	}
	return s
}
