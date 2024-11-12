package aggregate

import (
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ExprsCountOrder(count []string) []field.Expr {
	table := query.Order

	exprs := []field.Expr{}
	for _, v := range count {
		var expr field.Expr
		as := SubfixCount + v
		switch v {
		case "id":
			expr = table.ID.Count().As(as)
		case "created_at":
			expr = table.CreatedAt.Count().As(as)
		case "started_at":
			expr = table.StartedAt.Count().As(as)
		case "finished_at":
			expr = table.FinishedAt.Count().As(as)
		case "canceled_at":
			expr = table.CanceledAt.Count().As(as)

		default:
			expr = table.ID.Count().As("count")
		}

		exprs = append(exprs, expr)
	}
	return exprs
}
