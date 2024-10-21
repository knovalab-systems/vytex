package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ResourceFields(s query.IResourceDo, fields string) query.IResourceDo {

	resourceTable := query.Resource
	resourceExprs := []field.Expr{}
	resourceFields := strings.Split(fields, ",")
	colorFieldsArr := []string{}
	supplierFieldsArr := []string{}

	resourceSwitchFunc := func(v string) bool {
		if strings.HasPrefix(v, "color.") || v == "color" {
			colorFieldsArr = append(colorFieldsArr, strings.TrimPrefix(v, "color."))
			return true
		}

		if strings.HasPrefix(v, "supplier.") || v == "supplier" {
			supplierFieldsArr = append(colorFieldsArr, strings.TrimPrefix(v, "supplier."))
			return true
		}

		return false
	}

	resourceExprs = append(resourceExprs, resourceSwitch(resourceFields, resourceSwitchFunc)...)

	if len(colorFieldsArr) != 0 {
		resourceExprs = append(resourceExprs, resourceTable.ColorID)
		colorExprs := append(colorSwitch(colorFieldsArr, func(s string) bool { return false }), query.Color.ID)

		s = s.Preload(resourceTable.Color.Select(colorExprs...))
	}

	if len(supplierFieldsArr) != 0 {
		resourceExprs = append(resourceExprs, resourceTable.SupplierID)
		supplierExprs := append(supplierSwitch(supplierFieldsArr, func(s string) bool { return false }), query.Supplier.ID)

		s = s.Preload(resourceTable.Supplier.Select(supplierExprs...))
	}

	return s.Select(resourceExprs...)
}

func resourceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.Resource
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
		case "track":
			exprs = append(exprs, table.Track)
		case "cost":
			exprs = append(exprs, table.Cost)
		case "code":
			exprs = append(exprs, table.Code)
		case "color_id":
			exprs = append(exprs, table.ColorID)
		case "supplier_id":
			exprs = append(exprs, table.SupplierID)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "deleted_at":
			exprs = append(exprs, table.DeletedAt)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
