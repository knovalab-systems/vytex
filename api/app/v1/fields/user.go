package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func UserFields(s query.IUserDo, queryFields string) query.IUserDo {
	table := query.User
	exprs := []field.Expr{}
	roleFields := []string{}

	switchFunc := func(v string) bool {
		if strings.HasPrefix(v, "role.") || v == "role" {
			roleFields = append(roleFields, strings.TrimPrefix(v, "role."))
			return true
		}

		return false
	}
	fields := strings.Split(queryFields, ",")
	exprs = append(exprs, UserSwitch(fields, switchFunc)...)

	if len(roleFields) != 0 {
		exprs = append(exprs, table.RoleId)
		roleExprs := append(RoleSwitch(roleFields, func(s string) bool { return false }), query.Role.ID)

		s = s.Preload(table.Role.Select(roleExprs...))
	}

	return s.Select(exprs...)
}

func UserSwitch(fields []string, function func(string) bool) []field.Expr {
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
		case "*":
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
