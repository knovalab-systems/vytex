package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ReferenceFields(s query.IReferenceDo, fields string) query.IReferenceDo {
	referenceTable := query.Reference
	referenceFields := strings.Split(fields, ",")
	referenceExprs := []field.Expr{}
	colorsFields := []string{}
	piecesFields := []string{}

	referenceSwitchFunc := func(v string) bool {
		if strings.HasPrefix(v, "colors.") || v == "colors" {
			colorsFields = append(colorsFields, strings.TrimPrefix(v, "colors."))
			return true
		}

		if strings.HasPrefix(v, "pieces.") || v == "pieces" {
			piecesFields = append(piecesFields, strings.TrimPrefix(v, "pieces."))
			return true
		}
		return false
	}

	referenceExprs = append(referenceExprs, referenceSwitch(referenceFields, referenceSwitchFunc)...)

	if len(colorsFields) != 0 {
		referenceExprs = append(referenceExprs, referenceTable.ID)
		colorsExprs := append(colorByReferenceSwitch(colorsFields, func(s string) bool { return false }), query.ColorByReference.ReferenceID)
		s.Preload(referenceTable.Colors.Select(colorsExprs...))
	}


	if len(piecesFields) != 0 {
		referenceExprs = append(referenceExprs, referenceTable.ID)
		piecesExprs := append(imageByReferenceSwitch(piecesFields, func(s string) bool { return false }), query.ImageByReference.ReferenceID)
		s.Preload(referenceTable.Pieces.Select(piecesExprs...))
	}

	return s.Select(referenceExprs...)
}

func referenceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.Reference
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "code":
			exprs = append(exprs, table.Code)
		case "created_at":
			exprs = append(exprs, table.CreatedAt)
		case "deleted_at":
			exprs = append(exprs, table.DeletedAt)
		case "created_by":
			exprs = append(exprs, table.CreatedBy)
		case "track":
			exprs = append(exprs, table.Track)
		case "front":
			exprs = append(exprs, table.Front)
		case "time_by_task_ID":
			exprs = append(exprs, table.TimeByTaskID)
		case "back":
			exprs = append(exprs, table.Back)
		case "operational_list_id":
			exprs = append(exprs, table.OperationalListID)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}

func imageByReferenceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.ImageByReference
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "image_id":
			exprs = append(exprs, table.ImageID)
		case "reference_id":
			exprs = append(exprs, table.ReferenceID)

		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs
}

func colorByReferenceSwitch(fields []string, function func(string) bool) []field.Expr {

	table := query.ColorByReference
	exprs := []field.Expr{}

	for _, v := range fields {

		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "color_id":
			exprs = append(exprs, table.ColorID)
		default:
			exprs = append(exprs, table.ALL)
		}

	}

	return exprs

}
