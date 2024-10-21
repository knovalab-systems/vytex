package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func RoleFields(s query.IRoleDo, queryFields string) query.IRoleDo {
	fields := strings.Split(queryFields, ",")
	exprs := RoleSwitch(fields, func(s string) bool { return false })

	return s.Select(exprs...)
}

func RoleSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.Role
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "name":
			exprs = append(exprs, table.Name)
		case "code":
			exprs = append(exprs, table.Code)
		case "policies":
			exprs = append(exprs, table.Policies)
		case "*":
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
