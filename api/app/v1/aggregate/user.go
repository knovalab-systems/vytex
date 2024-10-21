package aggregate

import (
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ExprsCountUser(count []string) []field.Expr {
	table := query.User
	exprs := []field.Expr{}
	for _, v := range count {
		var expr field.Expr
		as := SubfixCount + v
		switch v {
		case "id":
			expr = table.ID.Count().As(as)
		case "deleted_at":
			expr = table.DeletedAt.Count().As(as)
		default:
			expr = table.ID.Count().As("count")
		}

		exprs = append(exprs, expr)
	}
	return exprs
}
