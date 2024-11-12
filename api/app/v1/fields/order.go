package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func OrderFields(s query.IOrderDo, queryFields string) query.IOrderDo {
	table := query.Order
	exprs := []field.Expr{}
	referenceFields := []string{}
	colorFields := []string{}

	fields := SlicesOrderFields{Order: strings.Split(queryFields, ",")}

	colorByReferenceSwitchFunc := func(v string) bool {

		if strings.HasPrefix(v, "color.") || v == "color" {
			colorFields = append(colorFields, strings.TrimPrefix(v, "color."))
			return true
		}

		if strings.HasPrefix(v, "resources.") {
			s = s.Preload(table.ColorByReference.Resources)
			s = s.Preload(table.ColorByReference.Resources.Resource)
			return true
		}

		if strings.HasPrefix(v, "fabrics.") {
			s = s.Preload(table.ColorByReference.Fabrics)
			s = s.Preload(table.ColorByReference.Fabrics.Fabric)
			return true
		}

		if strings.HasPrefix(v, "reference.") || v == "reference" {
			referenceFields = append(referenceFields, strings.TrimPrefix(v, "reference."))
			return true
		}

		return false
	}

	exprs = append(exprs, orderSwitch(fields.Order, OrderSwitchFunc(&fields))...)

	if len(fields.ColorByReference) != 0 {
		exprs = append(exprs, table.ColorByReferenceID)
		coloByReferenceExprs := append(colorByReferenceSwitch(fields.ColorByReference, colorByReferenceSwitchFunc), query.ColorByReference.ID)

		if len(referenceFields) != 0 {
			coloByReferenceExprs = append(coloByReferenceExprs, query.ColorByReference.ReferenceID)
			referenceExprs := append(ReferenceSwitch(referenceFields, func(s string) bool { return false }), query.Reference.ID)

			s = s.Preload(table.ColorByReference.Reference.Select(referenceExprs...))
		}

		if len(colorFields) != 0 {

			coloByReferenceExprs = append(coloByReferenceExprs, query.ColorByReference.ColorID)
			colorExprs := append(ColorSwitch(colorFields, func(s string) bool { return false }), query.Color.ID)

			s = s.Preload(table.ColorByReference.Color.Select(colorExprs...))

		}

		s = s.Preload(table.ColorByReference.Select(coloByReferenceExprs...))

	}

	if len(fields.CancelUser) != 0 {
		exprs = append(exprs, table.CanceledBy)
		cancelExprs := append(UserSwitch(fields.CancelUser, func(s string) bool { return false }), query.User.ID)

		s = s.Preload(table.CancelUser.Select(cancelExprs...))
	}

	if len(fields.OrderState) != 0 {
		exprs = append(exprs, table.OrderStateID)
		stateExprs := append(UserSwitch(fields.OrderState, func(s string) bool { return false }), query.OrderState.ID)

		s = s.Preload(table.OrderState.Select(stateExprs...))
	}

	if len(fields.CreateUser) != 0 {
		exprs = append(exprs, table.CreatedBy)
		createExprs := append(UserSwitch(fields.CreateUser, func(s string) bool { return false }), query.User.ID)

		s = s.Preload(table.CreateUser.Select(createExprs...))
	}

	if len(fields.Custom) != 0 {
		exprs = append(exprs, table.CustomID)
		customExprs := append(CustomSwitch(fields.Custom, func(s string) bool { return false }), query.Custom.ID)

		s = s.Preload(table.Custom.Select(customExprs...))

	}

	return s.Select(exprs...)
}

func orderSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.Order
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "order_state_id":
			exprs = append(exprs, table.OrderStateID)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "finished_at":
			exprs = append(exprs, table.FinishedAt)
		case "started_at":
			exprs = append(exprs, table.StartedAt)
		case "canceled_at":
			exprs = append(exprs, table.CanceledAt)
		case "color_by_reference_id":
			exprs = append(exprs, table.ColorByReferenceID)
		case "custom_id":
			exprs = append(exprs, table.CustomID)
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

func OrderSwitchFunc(fields *SlicesOrderFields) func(v string) bool {

	if fields == nil {
		return func(v string) bool { return false }
	}

	return func(v string) bool {

		if PreloadFields(v, "create_user", &fields.CreateUser) {
			return true
		}

		if PreloadFields(v, "cancel_user", &fields.CancelUser) {
			return true
		}

		if PreloadFields(v, "color_by_reference", &fields.ColorByReference) {
			return true
		}
		if PreloadFields(v, "custom", &fields.Custom) {
			return true
		}

		if PreloadFields(v, "order_state", &fields.OrderState) {
			return true
		}

		return false
	}

}
