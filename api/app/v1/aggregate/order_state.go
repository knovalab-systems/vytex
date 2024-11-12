package aggregate

import (
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ExprCountOrderState(count []string) []field.Expr {
	table := query.OrderState
	exprs := []field.Expr{}

	for _, v := range count {
		var expr field.Expr
		as := SubfixCount + v
		switch v {
		case "id":
			exprs = append(exprs, table.ID.Count().As(as))
		case "value":
			exprs = append(exprs, table.Value.Count().As(as))
		default:
			expr = table.ID.Count().As("count")
		}
		exprs = append(exprs, expr)
	}
	return exprs
}
