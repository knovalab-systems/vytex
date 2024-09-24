package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ColorFields(s query.IColorDo, fields string) query.IColorDo {
	fieldsArr := strings.Split(fields, ",")
	exprs := colorSwitch(fieldsArr, func(s string) bool { return false })

	return s.Select(exprs...)
}

func colorSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.Color
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "code":
			exprs = append(exprs, table.Code)
		case "name":
			exprs = append(exprs, table.Name)
		case "hex":
			exprs = append(exprs, table.Hex)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "deleted_at":
			exprs = append(exprs, table.DeletedAt)
		case "updated_at":
			exprs = append(exprs, table.UpdatedAt)
		default:
			exprs = append(exprs, table.ALL)
		}
	}

	return exprs
}
