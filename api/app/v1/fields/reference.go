package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func ReferenceFields(s query.IReferenceDo, queryFields string) query.IReferenceDo {
	table := query.Reference
	fields := strings.Split(queryFields, ",")
	exprs := []field.Expr{}
	colorsFields := []string{}
	piecesFields := []string{}
	fabricsFields := []string{}
	resourcesFields := []string{}

	switchFunc := func(v string) bool {
		if strings.HasPrefix(v, "colors.fabrics.") || v == "colors.fabrics" {
			fabricsFields = append(fabricsFields, strings.TrimPrefix(v, "colors.fabrics."))
			return true
		}

		if strings.HasPrefix(v, "colors.resources.") || v == "colors.resources" {
			resourcesFields = append(resourcesFields, strings.TrimPrefix(v, "colors.resources."))
			return true
		}

		if strings.HasPrefix(v, "colors.") || v == "colors" {
			colorsFields = append(colorsFields, strings.TrimPrefix(v, "colors."))
			return true
		}

		if strings.HasPrefix(v, "operations.") || v == "operations" {
			operationsExprs := operationsSwitch(piecesFields, func(s string) bool { return false })
			s.Preload(table.Operations.Select(operationsExprs...))
			return true
		}

		if strings.HasPrefix(v, "time_by_task.") || v == "time_by_task" {
			exprs = append(exprs, table.TimeByTaskID)
			s.Preload(table.TimeByTask)
			return true
		}
		return false
	}

	exprs = append(exprs, ReferenceSwitch(fields, switchFunc)...)

	if len(colorsFields) != 0 {
		exprs = append(exprs, table.ID)
		colorsExprs := append(colorByReferenceSwitch(colorsFields, func(s string) bool { return false }), query.ColorByReference.ReferenceID)

		// Preload for Fabrics
		if len(fabricsFields) != 0 {
			fabricsExprs := fabricByReferenceSwitch(fabricsFields, func(s string) bool { return false })
			s.Preload(table.Colors.Fabrics.Select(fabricsExprs...))
			s.Preload(table.Colors.Fabrics.Fabric)
		}

		// Preload for Resources
		if len(resourcesFields) != 0 {
			resourcesExprs := resourceByReferenceSwitch(resourcesFields, func(s string) bool { return false })
			s.Preload(table.Colors.Resources.Select(resourcesExprs...))
			s.Preload(table.Colors.Resources.Resource)
		}

		s.Preload(table.Colors.Select(colorsExprs...))
	}

	return s.Select(exprs...)
}

func ReferenceSwitch(fields []string, function func(string) bool) []field.Expr {
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
		case "time_by_task_id":
			exprs = append(exprs, table.TimeByTaskID)
		case "back":
			exprs = append(exprs, table.Back)
		case "*":
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
		case "*":
			exprs = append(exprs, table.ALL)
		}
	}

	return exprs
}

func fabricByReferenceSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.FabricByReference
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
		case "fabric_id":
			exprs = append(exprs, table.FabricId)
		case "color_by_reference_id":
			exprs = append(exprs, table.ColorByReferenceID)
		case "*":
			exprs = append(exprs, table.ALL)
		}
	}

	return exprs
}

func resourceByReferenceSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.ResourceByReference
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
		case "resource_id":
			exprs = append(exprs, table.ResourceId)
		case "color_by_reference_id":
			exprs = append(exprs, table.ColorByReferenceID)
		case "*":
			exprs = append(exprs, table.ALL)
		}
	}

	return exprs
}

func operationsSwitch(fields []string, function func(string) bool) []field.Expr {
	table := query.Operation
	exprs := []field.Expr{}

	for _, v := range fields {
		if function(v) {
			continue
		}

		switch v {
		case "id":
			exprs = append(exprs, table.ID)
		case "description":
			exprs = append(exprs, table.Description)
		case "*":
			exprs = append(exprs, table.ALL)
		}
	}

	return exprs
}
