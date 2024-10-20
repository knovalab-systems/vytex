package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func CustomFields(s query.ICustomDo, queryFields string) query.ICustomDo {

	table := query.Custom
	exprs := []field.Expr{}
	fields := strings.Split(queryFields, ",")
	cancelFieldsArr := []string{}
	createFieldsArr := []string{}

	switchFunc := func(v string) bool {
		if strings.HasPrefix(v, "create_user.") || v == "create_user" {
			cancelFieldsArr = append(cancelFieldsArr, strings.TrimPrefix(v, "create_user."))
			return true
		}

		if strings.HasPrefix(v, "cancel_user.") || v == "cancel_user" {
			createFieldsArr = append(cancelFieldsArr, strings.TrimPrefix(v, "cancel_user."))
			return true
		}

		return false
	}

	exprs = append(exprs, customSwitch(fields, switchFunc)...)

	if len(cancelFieldsArr) != 0 {
		exprs = append(exprs, table.CanceledBy)
		cancelExprs := append(UserSwitch(cancelFieldsArr, func(s string) bool { return false }), query.Color.ID)

		s = s.Preload(table.CancelUser.Select(cancelExprs...))
	}

	if len(createFieldsArr) != 0 {
		exprs = append(exprs, table.CreatedBy)
		createExprs := append(UserSwitch(createFieldsArr, func(s string) bool { return false }), query.Supplier.ID)

		s = s.Preload(table.CreateUser.Select(createExprs...))
	}

	return s.Select(exprs...)
}

func customSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.Custom
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "client":
			exprs = append(exprs, table.Client)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "finished_at":
			exprs = append(exprs, table.FinishedAt)
		case "canceled_at":
			exprs = append(exprs, table.CanceledAt)
		case "created_by":
			exprs = append(exprs, table.CreatedBy)
		case "canceled_by":
			exprs = append(exprs, table.CanceledBy)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
