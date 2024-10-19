package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

type SupplierService struct {
}

func (m *SupplierService) SelectSuppliers(q *models.Query) ([]*models.Supplier, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Supplier
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.SupplierFields(s, q.Fields)
	}

	// run query
	suppliers, err := s.Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return suppliers, nil
}

func (m *SupplierService) SelectSupplier(q *models.ReadSupplier) (*models.Supplier, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Supplier
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.SupplierFields(s, q.Fields)
	}

	// run query
	supplier, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return supplier, nil
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

func (m *SupplierService) CreateSupplier(b *models.SupplierCreateBody) (*models.Supplier, error) {

	err := helpers.CheckSupplierExists(b.Code, b.Nit)
	if err != nil {
		return nil, err
	}

	supplier := &models.Supplier{
		Name:  b.Name,
		Nit:   b.Nit,
		Brand: b.Brand,
		Code:  b.Code,
	}

	err = query.Supplier.Create(supplier)
	if err != nil {
		return nil, err
	}

	return supplier, nil
}

func (m *SupplierService) UpdateSupplier(b *models.SupplierUpdateBody) (*models.Supplier, error) {
	err := helpers.CheckSupplierExists(b.Code, b.Nit)
	if err != nil {
		return nil, err
	}

	table := query.Supplier

	updateMap := formats.SupplierUpdateMap(b)
	if len(updateMap) == 0 {
		return nil, problems.SuppliersBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	supplier, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	return supplier, nil
}
