package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func OrderStateFields(s query.IOrderStateDo, queryFields string) query.IOrderStateDo {
	fields := strings.Split(queryFields, ",")
	exprs := orderStateSwitch(fields, func(s string) bool { return false })

	return s.Select(exprs...)
}

func orderStateSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.TaskControlState
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
		case "value":
			exprs = append(exprs, table.Value)
		case "*":
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
