package fields

import (
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func referenceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.Reference
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
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs

}

func colorByReferenceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.ColorByReference
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "color_id":
			exprs = append(exprs, table.ColorID)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs

}
