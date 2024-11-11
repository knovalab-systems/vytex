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
	ordersFields := []string{}

	switchFunc := func(v string) bool {
		if PreloadFields(v, "create_user", &createFieldsArr) {
			return true
		}

		if PreloadFields(v, "cancel_user", &cancelFieldsArr) {
			return true
		}

		if PreloadFields(v, "orders", &ordersFields) {
			return true
		}

		return false
	}

	exprs = append(exprs, customSwitch(fields, switchFunc)...)

	if len(cancelFieldsArr) != 0 {
		exprs = append(exprs, table.CanceledBy)
		cancelExprs := append(UserSwitch(cancelFieldsArr, func(s string) bool { return false }), query.User.ID)

		s = s.Preload(table.CancelUser.Select(cancelExprs...))
	}

	if len(createFieldsArr) != 0 {
		exprs = append(exprs, table.CreatedBy)
		createExprs := append(UserSwitch(createFieldsArr, func(s string) bool { return false }), query.User.ID)

		s = s.Preload(table.CreateUser.Select(createExprs...))
	}

	if len(ordersFields) != 0 {
		colorByReferenceFields := []string{}
		ordersExprs := append(orderSwitch(ordersFields, func(s string) bool {
			return PreloadFields(s, "color_by_reference", &colorByReferenceFields)
		}), query.Order.CustomID)

		if len(colorByReferenceFields) != 0 {
			ordersExprs = append(ordersExprs, query.Order.ColorByReferenceID)
			colorFields := []string{}
			referenceFields := []string{}

			colorByReferenceExprs := append(colorByReferenceSwitch(colorByReferenceFields, func(s string) bool {

				if PreloadFields(s, "reference", &referenceFields) {
					return true
				}

				if PreloadFields(s, "color", &colorFields) {
					return true
				}

				return false
			}), query.ColorByReference.ID)

			if len(colorFields) != 0 {
				colorByReferenceExprs = append(colorByReferenceExprs, query.ColorByReference.ColorID)
				colorExprs := append(colorSwitch(colorFields, func(s string) bool { return false }), query.Color.ID)
				s = s.Preload(table.Orders.ColorByReference.Color.Select(colorExprs...))
			}

			if len(referenceFields) != 0 {
				colorByReferenceExprs = append(colorByReferenceExprs, query.ColorByReference.ReferenceID)
				referenceExprs := append(referenceSwitch(referenceFields, func(s string) bool { return false }), query.Reference.ID)
				s = s.Preload(table.Orders.ColorByReference.Reference.Select(referenceExprs...))
			}

			s = s.Preload(table.Orders.ColorByReference.Select(colorByReferenceExprs...))

		}

		s = s.Preload(table.Orders.Select(ordersExprs...))
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
		case "*":
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}
