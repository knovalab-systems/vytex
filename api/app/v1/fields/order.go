package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func OrderFields(s query.IOrderDo, queryFields string) query.IOrderDo {
	table := query.Order
	fields := strings.Split(queryFields, ",")
	exprs := []field.Expr{}
	colorByReferenceFields := []string{}
	referenceFields := []string{}

	switchFunc := func(v string) bool {

		if strings.HasPrefix(v, "create_user.") || v == "create_user" {
			exprs = append(exprs, table.CreatedBy)
			s = s.Preload(table.CreateUser)
			return true
		}

		if strings.HasPrefix(v, "cancel_user.") || v == "cancel_user" {
			exprs = append(exprs, table.CanceledBy)
			s = s.Preload(table.CancelUser)
			return true
		}

		if strings.HasPrefix(v, "custom.") || v == "custom" {
			exprs = append(exprs, table.CustomID)
			s = s.Preload(table.Custom)
			return true
		}

		if strings.HasPrefix(v, "color_by_reference.") || v == "color_by_reference" {
			colorByReferenceFields = append(colorByReferenceFields, strings.TrimPrefix(v, "color_by_reference."))
			return true
		}

		if strings.HasPrefix(v, "order_state.") || v == "order_state" {
			exprs = append(exprs, table.OrderStateID)
			s = s.Preload(table.OrderState)
			return true
		}

		return false
	}

	colorByReferenceSwitchFunc := func(v string) bool {

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

	exprs = append(exprs, orderSwitch(fields, switchFunc)...)

	if len(colorByReferenceFields) != 0 {
		exprs = append(exprs, table.ColorByReferenceID)
		coloByReferenceExprs := append(colorByReferenceSwitch(colorByReferenceFields, colorByReferenceSwitchFunc), query.ColorByReference.ID)

		if len(referenceFields) != 0 {
			coloByReferenceExprs = append(coloByReferenceExprs, query.ColorByReference.ReferenceID)
			referenceExprs := append(referenceSwitch(referenceFields, func(s string) bool { return false }), query.Reference.ID)

			s = s.Preload(table.ColorByReference.Reference.Select(referenceExprs...))
		}

		s = s.Preload(table.ColorByReference.Select(coloByReferenceExprs...))

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
