package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func TaskControlFields(s query.ITaskControlDo, fields string) query.ITaskControlDo {

	fieldsArr := strings.Split(fields, ",")
	table := query.TaskControl
	var f []field.Expr
	orderFields := []string{}

	for _, v := range fieldsArr {

		if strings.HasPrefix(v, "order.") {
			f = append(f, table.OrderID)
			orderFields = append(orderFields, strings.ReplaceAll(v, "order.", ""))
			continue
		}

		switch v {
		case "id":
			f = append(f, table.ID)
		case "created_at":
			f = append(f, table.CreatedAt)
		case "started_at":
			f = append(f, table.StartedAt)
		case "rejected_at":
			f = append(f, table.RejectedAt)
		case "finished_at":
			f = append(f, table.FinishedAt)
		case "order_id":
			f = append(f, table.OrderID)
		case "order":
			f = append(f, table.OrderID)
			s.Preload(table.Order.RelationField)
		case "task_id":
			f = append(f, table.TaskID)
		case "task":
			f = append(f, table.TaskID)
			s.Preload(table.Task.RelationField)
		case "next_id":
			f = append(f, table.NextID)
		case "next":
			f = append(f, table.NextID)
			s.Preload(table.Next.RelationField)
		case "previous_id":
			f = append(f, table.PreviousID)
		case "previous":
			f = append(f, table.PreviousID)
			s.Preload(table.Previous.RelationField)
		default:
			f = append(f, table.ALL)
		}
	}

	if len(orderFields) != 0 {
		colorByReferenceFields := []string{}

		orderTable := query.Order
		orderF := []field.Expr{orderTable.ID}

		for _, v := range orderFields {

			if strings.HasPrefix(v, "color_by_reference.") {
				orderF = append(orderF, orderTable.ColorByReferenceID)
				colorByReferenceFields = append(colorByReferenceFields, strings.ReplaceAll(v, "color_by_reference.", ""))
				continue
			}

			switch v {
			case "id":
				orderF = append(orderF, orderTable.ID)
			default:
				orderF = append(orderF, orderTable.ALL)
			}
		}

		if len(colorByReferenceFields) != 0 {
			referenceFields := []string{}

			colorByReferenceTable := query.ColorByReference
			ColorByReferenceF := []field.Expr{colorByReferenceTable.ID}

			for _, v := range colorByReferenceFields {

				if strings.HasPrefix(v, "reference.") {
					ColorByReferenceF = append(ColorByReferenceF, colorByReferenceTable.ReferenceID)
					referenceFields = append(referenceFields, strings.ReplaceAll(v, "reference.", ""))
					continue
				}

				switch v {
				case "id":
					ColorByReferenceF = append(ColorByReferenceF, colorByReferenceTable.ID)
				case "color_id":
					ColorByReferenceF = append(ColorByReferenceF, colorByReferenceTable.ColorID)
				default:
					ColorByReferenceF = append(ColorByReferenceF, colorByReferenceTable.ALL)
				}
			}

			if len(referenceFields) != 0 {

				referenceTable := query.Reference
				referenceF := []field.Expr{referenceTable.ID}

				for _, v := range referenceFields {

					switch v {
					case "id":
						referenceF = append(referenceF, referenceTable.ID)
					case "code":
						referenceF = append(referenceF, referenceTable.Code)
					default:
						referenceF = append(referenceF, referenceTable.ALL)
					}
				}

				s = s.Preload(table.Order.ColorByReference.Reference.Select(referenceF...))

			}

			s = s.Preload(table.Order.ColorByReference.Select(ColorByReferenceF...))
		}

		s = s.Preload(table.Order.Select(orderF...))
	}

	return s.Select(f...)
}
