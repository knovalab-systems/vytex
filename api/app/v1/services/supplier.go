package services

import (
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type SupplierService struct {
}

func (m *SupplierService) SelectSuppliers(q *models.Query) ([]*models.Supplier, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.SuppliersBadRequest()
	}

	// def query
	table := query.Supplier
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = supplierFields(s, q.Fields)

	// run query
	suppliers, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return suppliers, nil
}

func (m *SupplierService) AggregationSuppliers(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Supplier
	s := table.Unscoped()
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		countArr := strings.Split(q.Count, ",")
		countObj := make(map[string]int64)

		for _, v := range countArr {
			switch v {
			case "id":
				count, err := s.Select(table.ID).Count()
				if err != nil {
					return nil, problems.ServerError()
				}
				countObj["id"] = count
			default:
				if aggregateElem.Count == nil {
					count, err := s.Count()
					if err != nil {
						return nil, problems.ServerError()
					}
					aggregateElem.Count = count
				}
			}
		}
		if len(countObj) > 0 {
			aggregateElem.Count = countObj
		}
	}

	return []*models.AggregateData{&aggregateElem}, nil

}

func supplierFields(s query.ISupplierDo, fields string) query.ISupplierDo {
	if fields != "" {
		table := query.Supplier
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {
			switch v {
			case "id":
				f = append(f, table.ID)
			case "name":
				f = append(f, table.Name)
			case "nit":
				f = append(f, table.Nit)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			case "updated_at":
				f = append(f, table.UpdatedAt)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}