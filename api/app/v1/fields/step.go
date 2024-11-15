package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func StepFields(s query.IStepDo, queryFields string) query.IStepDo {
	fields := strings.Split(queryFields, ",")
	table := query.Step
	var f []field.Expr

	for _, v := range fields {

		if strings.HasPrefix(v, "tasks.") {
			s = s.Preload(table.Tasks)
			continue
		}

		switch v {
		case "id":
			f = append(f, table.ID)
		case "name":
			f = append(f, table.Name)
		case "value":
			f = append(f, table.Value)
		case "tasks":
			s = s.Preload(table.Tasks)
		default:
			f = append(f, table.ALL)
		}

	}

	return s.Select(f...)
}
