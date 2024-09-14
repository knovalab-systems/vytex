package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func orderFields(s query.IOrderDo, fields []string) query.IOrderDo {

	table := query.Order
	var f []field.Expr
	colorByReferenceFields := []string{}
	//fabricByrefenceFields := []string{}
	//resourceByReferenceFields := []string{}

	for _, v := range fields {

		if strings.HasPrefix(v, "create_user.") {
			f = append(f, table.CreatedBy)
			s = s.Preload(table.CreateUser)
			continue
		}

		if strings.HasPrefix(v, "cancel_user.") {
			f = append(f, table.CanceledBy)
			s = s.Preload(table.CancelUser)
			continue
		}

		if strings.HasPrefix(v, "custom.") {
			f = append(f, table.CustomID)
			s = s.Preload(table.Custom)
			continue
		}

		if strings.HasPrefix(v, "color_by_reference.") {
			colorByReferenceFields = append(colorByReferenceFields, strings.ReplaceAll(v, "color_by_reference.", ""))
			continue
		}

		if strings.HasPrefix(v, "order_state.") {
			f = append(f, table.OrderStateID)
			s = s.Preload(table.OrderState)
			continue
		}

		switch v {
		case "id":
			f = append(f, table.ID)
		case "order_state_id":
			f = append(f, table.OrderStateID)
		case "created_at":
			f = append(f, table.CreatedAt)
		case "finished_at":
			f = append(f, table.FinishedAt)
		case "started_at":
			f = append(f, table.StartedAt)
		case "canceled_at":
			f = append(f, table.CanceledAt)
		case "color_by_reference_id":
			f = append(f, table.ColorByReferenceID)
		case "custom_id":
			f = append(f, table.CustomID)
		case "created_by":
			f = append(f, table.CreatedBy)
		case "canceled_by":
			f = append(f, table.CanceledBy)
		case "cancel_user":
			f = append(f, table.CanceledBy)
			s = s.Preload(table.CancelUser)
		case "create_user":
			f = append(f, table.CreatedBy)
			s = s.Preload(table.CreateUser)
		case "color_by_reference":
			f = append(f, table.ColorByReferenceID)
			s = s.Preload(table.ColorByReference)
		case "custom":
			f = append(f, table.CustomID)
			s = s.Preload(table.Custom)
		default:
			f = append(f, table.ALL)
		}
	}

	if len(colorByReferenceFields) != 0 {
		f = append(f, table.ColorByReferenceID)
		coloByReferenceTable := query.ColorByReference
		coloByReferenceFields := []field.Expr{}

		for _, v := range colorByReferenceFields {

			if strings.HasPrefix(v, "resources.") {
				s = s.Preload(table.ColorByReference.Resources)
				s = s.Preload(table.ColorByReference.Resources.Resource)
				continue
			}

			if strings.HasPrefix(v, "fabrics.") {
				s = s.Preload(table.ColorByReference.Fabrics)
				s = s.Preload(table.ColorByReference.Fabrics.Fabric)
				continue
			}

			switch v {
			case "id":
				coloByReferenceFields = append(coloByReferenceFields, coloByReferenceTable.ID)
			default:
				coloByReferenceFields = append(coloByReferenceFields, coloByReferenceTable.ALL)
			}

			s = s.Preload(table.ColorByReference.Select(coloByReferenceFields...))
		}

	}

	return s.Select(f...)
}
