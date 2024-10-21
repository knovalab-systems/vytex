package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func SupplierFields(s query.ISupplierDo, fields string) query.ISupplierDo {
	fieldsArr := strings.Split(fields, ",")
	exprs := supplierSwitch(fieldsArr, func(s string) bool { return false })

	return s.Select(exprs...)
}

func supplierSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.Supplier
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
		case "brand":
			exprs = append(exprs, table.Brand)
		case "code":
			exprs = append(exprs, table.Code)
		case "nit":
			exprs = append(exprs, table.Nit)
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
