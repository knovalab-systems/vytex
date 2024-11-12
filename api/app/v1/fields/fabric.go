package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func FabricFields(s query.IFabricDo, queryFields string) query.IFabricDo {

	table := query.Fabric
	exprs := []field.Expr{}
	fields := strings.Split(queryFields, ",")
	colorFields := []string{}
	supplierFields := []string{}
	compositionFields := []string{}

	switchFunc := func(v string) bool {
		if strings.HasPrefix(v, "color.") || v == "color" {
			colorFields = append(colorFields, strings.TrimPrefix(v, "color."))
			return true
		}

		if strings.HasPrefix(v, "supplier.") || v == "supplier" {
			supplierFields = append(supplierFields, strings.TrimPrefix(v, "supplier."))
			return true
		}

		if strings.HasPrefix(v, "composition.") || v == "composition" {
			compositionFields = append(compositionFields, strings.TrimPrefix(v, "composition."))
			return true
		}
		return false
	}

	exprs = append(exprs, FabricSwitch(fields, switchFunc)...)

	if len(colorFields) != 0 {
		exprs = append(exprs, table.ColorID)
		colorExprs := append(ColorSwitch(colorFields, func(s string) bool { return false }), query.Color.ID)

		s = s.Preload(table.Color.Select(colorExprs...))
	}

	if len(supplierFields) != 0 {
		exprs = append(exprs, table.SupplierID)
		supplierExprs := append(supplierSwitch(supplierFields, func(s string) bool { return false }), query.Supplier.ID)

		s = s.Preload(table.Supplier.Select(supplierExprs...))
	}

	if len(compositionFields) != 0 {
		exprs = append(exprs, table.CompositionID)
		s = s.Preload(table.Composition)
	}

	return s.Select(exprs...)
}

func FabricSwitch(fields []string, function func(string) bool) []field.Expr {

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
		case "*":
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
