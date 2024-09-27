package services

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type ResourceService struct {
}

func (m *ResourceService) SelectResources(q *models.Query) ([]*models.Resource, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Resource
	s := table.Unscoped()

	// def subquery
	table2 := table.As("table2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("table2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = resourceFields(s, q.Fields)

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ResourceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ResourceBadRequest()
		}
	}

	// run query
	resources, err := s.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(field.NewInt64("table2", "id_max").EqCol(table.ID)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return resources, nil
}

func (m *ResourceService) SelectResource(q *models.ResourceRead) (*models.Resource, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Resource
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = resourceFields(s, q.Fields)

	// run query
	resource, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return resource, nil
}

func (m *ResourceService) AggregationResources(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Resource
	s := table.Unscoped().Group(table.Code)
	aggregateElem := models.AggregateData{Count: nil}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ResourceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ResourceBadRequest()
		}
	}

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

func (m *ResourceService) CreateResource(b *models.ResourceCreateBody) (*models.Resource, error) {
	err := checkResourceExist(b.Code)
	if err != nil {
		return nil, err
	}

	resource := &models.Resource{
		Name:       b.Name,
		SupplierID: b.Supplier,
		ColorID:    b.Color,
		Cost:       b.Cost,
		Code:       b.Code,
	}

	err = query.Resource.Create(resource)
	if err != nil {
		return nil, err
	}

	return resource, nil
}

func (m *ResourceService) UpdateResource(b *models.ResourceUpdateBody) (*models.Resource, error) {
	table := query.Resource

	resource, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	hasChanges, err := formats.ResourceUpdateVersion(b, resource, checkResourceExist)
	if err != nil {
		return nil, err
	}

	if hasChanges {
		resource.ID = 0
		resource.CreatedAt = nil
		err = table.Create(resource)
		if err != nil {
			return nil, problems.ServerError()
		}
	}

	return resource, nil
}

func checkResourceExist(code string) error {
	table := query.Resource

	// def subquery
	table2 := table.As("table2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("table2")

	_, err := table.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(table.Where(field.NewInt64("table2", "id_max").EqCol(table.ID)).Where(table.Code.Eq(code))).
		First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	return problems.ResourceExists()
}

func resourceFields(s query.IResourceDo, fields string) query.IResourceDo {
	if fields != "" {
		table := query.Resource
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "color.") {
				f = append(f, table.ColorID)
				s = s.Preload(table.Color)
				continue
			}

			if strings.HasPrefix(v, "supplier.") {
				f = append(f, table.SupplierID)
				s = s.Preload(table.Supplier)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "name":
				f = append(f, table.Name)
			case "cost":
				f = append(f, table.Cost)
			case "code":
				f = append(f, table.Code)
			case "color_id":
				f = append(f, table.ColorID)
			case "color":
				f = append(f, table.ColorID)
				s = s.Preload(table.Color)
			case "supplier_id":
				f = append(f, table.SupplierID)
			case "supplier":
				f = append(f, table.SupplierID)
				s = s.Preload(table.Supplier)
			case "created_at":
				f = append(f, table.CreatedAt)
			case "deleted_at":
				f = append(f, table.DeletedAt)
			default:
				f = append(f, table.ALL)
			}
		}
		s = s.Select(f...)
	}
	return s
}
