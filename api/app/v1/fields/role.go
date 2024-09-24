package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func RoleFields(s query.IRoleDo, fields string) query.IRoleDo {
	fieldsArr := strings.Split(fields, ",")
	exprs := roleSwitch(fieldsArr, func(s string) bool { return false })

	return s.Select(exprs...)
}

func roleSwitch(fields []string, function func(string) bool) []field.Expr {
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
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
