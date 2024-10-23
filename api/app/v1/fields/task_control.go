package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func TaskControlFields(s query.ITaskControlDo, queryFields string) query.ITaskControlDo {
	table := query.TaskControl
	fieldsArr := strings.Split(queryFields, ",")
	exprs := []field.Expr{}
	orderFields := []string{}

	for _, v := range fieldsArr {

		if strings.HasPrefix(v, "order.") {
			orderFields = append(orderFields, strings.ReplaceAll(v, "order.", ""))
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "started_at":
			exprs = append(exprs, table.StartedAt)
		case "rejected_at":
			exprs = append(exprs, table.RejectedAt)
		case "finished_at":
			exprs = append(exprs, table.FinishedAt)
		case "task_control_state_id":
			exprs = append(exprs, table.TaskControlStateID)
		case "order_id":
			exprs = append(exprs, table.OrderID)
		case "order":
			exprs = append(exprs, table.OrderID)
			s.Preload(table.Order.RelationField)
		case "task_id":
			exprs = append(exprs, table.TaskID)
		case "task":
			exprs = append(exprs, table.TaskID)
			s.Preload(table.Task.RelationField)
		case "next_id":
			exprs = append(exprs, table.NextID)
		case "next":
			exprs = append(exprs, table.NextID)
			s.Preload(table.Next.RelationField)
		case "previous_id":
			exprs = append(exprs, table.PreviousID)
		case "previous":
			exprs = append(exprs, table.PreviousID)
			s.Preload(table.Previous.RelationField)
		case "*":
			exprs = append(exprs, table.ALL)
		}
	}

	if len(orderFields) != 0 {
		exprs = append(exprs, table.OrderID)
		colorByReferenceFields := []string{}

		orderExprs := []field.Expr{query.Order.ID}

		for _, v := range orderFields {

			if strings.HasPrefix(v, "color_by_reference.") {
				colorByReferenceFields = append(colorByReferenceFields, strings.ReplaceAll(v, "color_by_reference.", ""))
				continue
			}

			switch v {
			case "id":
				orderExprs = append(orderExprs, query.Order.ID)
			default:
				orderExprs = append(orderExprs, query.Order.ALL)
			}
		}

		if len(colorByReferenceFields) != 0 {
			orderExprs = append(orderExprs, query.Order.ColorByReferenceID)
			referenceFields := []string{}
			colorFields := []string{}

			colorByReferenceF := []field.Expr{query.ColorByReference.ID}

			for _, v := range colorByReferenceFields {

				if strings.HasPrefix(v, "reference.") {
					referenceFields = append(referenceFields, strings.ReplaceAll(v, "reference.", ""))
					continue
				}

				if strings.HasPrefix(v, "color.") {
					colorFields = append(colorFields, strings.ReplaceAll(v, "color.", ""))
					continue
				}

				switch v {
				case "id":
					colorByReferenceF = append(colorByReferenceF, query.ColorByReference.ID)
				case "color_id":
					colorByReferenceF = append(colorByReferenceF, query.ColorByReference.ColorID)
				default:
					colorByReferenceF = append(colorByReferenceF, query.ColorByReference.ALL)
				}
			}

			if len(colorFields) != 0 {
				colorByReferenceF = append(colorByReferenceF, query.ColorByReference.ColorID)
				colorF := append(colorSwitch(colorFields, func(string) bool { return false }), query.Color.ID)

				s = s.Preload(table.Order.ColorByReference.Color.Select(colorF...))
			}

			if len(referenceFields) != 0 {
				colorByReferenceF = append(colorByReferenceF, query.ColorByReference.ReferenceID)
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

			s = s.Preload(table.Order.ColorByReference.Select(colorByReferenceF...))
		}

		s = s.Preload(table.Order.Select(orderExprs...))
	}

	return s.Select(exprs...)
}
