package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func TaskControlStateFields(s query.ITaskControlStateDo, queryFields string) query.ITaskControlStateDo {
	fields := strings.Split(queryFields, ",")
	exprs := taskControlStateSwitch(fields, func(s string) bool { return false })

	return s.Select(exprs...)
}

func taskControlStateSwitch(fields []string, function func(string) bool) []field.Expr {
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
