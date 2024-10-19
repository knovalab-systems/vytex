package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func FabricFields(s query.IFabricDo, fields string) query.IFabricDo {

	fabricTable := query.Fabric
	fabricExprs := []field.Expr{}
	fabricFields := strings.Split(fields, ",")
	colorFieldsArr := []string{}
	supplierFieldsArr := []string{}
	compositionFieldsArr := []string{}

	fabricSwitchFunc := func(v string) bool {
		if strings.HasPrefix(v, "color.") || v == "color" {
			colorFieldsArr = append(colorFieldsArr, strings.TrimPrefix(v, "color."))
			return true
		}

		if strings.HasPrefix(v, "supplier.") || v == "supplier" {
			supplierFieldsArr = append(supplierFieldsArr, strings.TrimPrefix(v, "supplier."))
			return true
		}

		if strings.HasPrefix(v, "composition.") || v == "composition" {
			compositionFieldsArr = append(compositionFieldsArr, strings.TrimPrefix(v, "composition."))
			return true
		}
		return false
	}

	fabricExprs = append(fabricExprs, fabricSwitch(fabricFields, fabricSwitchFunc)...)

	if len(colorFieldsArr) != 0 {
		fabricExprs = append(fabricExprs, fabricTable.ColorID)
		colorExprs := append(colorSwitch(colorFieldsArr, func(s string) bool { return false }), query.Color.ID)

		s = s.Preload(fabricTable.Color.Select(colorExprs...))
	}

	if len(supplierFieldsArr) != 0 {
		fabricExprs = append(fabricExprs, fabricTable.SupplierID)
		supplierExprs := append(supplierSwitch(supplierFieldsArr, func(s string) bool { return false }), query.Supplier.ID)

		s = s.Preload(fabricTable.Supplier.Select(supplierExprs...))
	}

	if len(compositionFieldsArr) != 0 {
		fabricExprs = append(fabricExprs, fabricTable.CompositionID)
		s = s.Preload(fabricTable.Supplier)
	}

	return s.Select(fabricExprs...)
}

func fabricSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.Fabric
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
		case "cost":
			exprs = append(exprs, table.Cost)
		case "track":
			exprs = append(exprs, table.Track)
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
		case "composition_id":
			exprs = append(exprs, table.CompositionID)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
