package aggregate

import (
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ExprsCountCustoms(count []string) []field.Expr {
	table := query.Custom
	exprs := []field.Expr{}
	for _, v := range count {
		var expr field.Expr
		as := SubfixCount + v
		switch v {
		case "client":
			expr = table.Client.Count().As(as)
		default:
			expr = table.ID.Count().As("count")
		}
		exprs = append(exprs, expr)
	}
	return exprs
}
