package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func RoleFields(s query.IRoleDo, fields string) query.IRoleDo {

	fieldsArr := strings.Split(fields, ",")
	table := query.Role
	var f []field.Expr

	for _, v := range fieldsArr {

		switch v {
		case "id":
			f = append(f, table.ID)
		case "name":
			f = append(f, table.Name)
		case "code":
			f = append(f, table.Code)
		case "policies":
			f = append(f, table.Policies)
		default:
			f = append(f, table.ALL)
		}

	}

	return s.Select(f...)
}
