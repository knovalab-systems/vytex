package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func OrderStateFields(s query.IOrderStateDo, fields string) query.IOrderStateDo {

	fieldsArr := strings.Split(fields, ",")
	table := query.OrderState
	var f []field.Expr

	for _, v := range fieldsArr {

		switch v {
		case "id":
			f = append(f, table.ID)
		case "name":
			f = append(f, table.Name)
		case "value":
			f = append(f, table.Value)
		default:
			f = append(f, table.ALL)
		}
	}

	return s.Select(f...)

}
