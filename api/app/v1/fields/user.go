package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func UserFields(s query.IUserDo, fields string) query.IUserDo {
	userTable := query.User
	userFields := strings.Split(fields, ",")
	userExprs := []field.Expr{}
	roleFieldsArr := []string{}

	switchFunc := func(v string) bool {
		if strings.HasPrefix(v, "role.") || v == "role" {
			roleFieldsArr = append(roleFieldsArr, strings.TrimPrefix(v, "role."))
			return true
		}

		return false
	}

	userExprs = append(userExprs, userSwitch(userFields, switchFunc)...)

	if len(roleFieldsArr) != 0 {
		userExprs = append(userExprs, userTable.RoleId)
		roleExprs := append(roleSwitch(roleFieldsArr, func(s string) bool { return false }), query.Role.ID)

		s = s.Preload(userTable.Role.Select(roleExprs...))
	}

	return s.Select(userExprs...)
}

func userSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.User
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "username":
			exprs = append(exprs, table.Username)
		case "name":
			exprs = append(exprs, table.Name)
		case "password":
			exprs = append(exprs, table.Password)
		case "role_id":
			exprs = append(exprs, table.RoleId)
		case "deleted_at":
			exprs = append(exprs, table.DeletedAt)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "updated_at":
			exprs = append(exprs, table.UpdatedAt)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
