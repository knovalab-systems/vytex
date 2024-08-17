package services

import (
	"errors"
	"log"
	"strings"

	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

type ResourceService struct {
}

func (m *ResourceService) SelectResources(q *models.Query) ([]*models.Resource, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ResourcesBadRequest()
	}

	// def query
	table := query.Resource
	s := table.Unscoped()

	// def subquery
	table2 := table.As("table2")
	subQuery := table.Unscoped().
		Group(table.Code).
		Select(table.Code, table.CreatedAt.Max().As("created_at_max")).
		As("table2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = resourceFields(s, q.Fields)

	// run query
	resources, err := s.Unscoped().LeftJoin(subQuery, table2.Code.EqCol(table.Code)).
		Where(field.NewInt64("table2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return resources, nil
}

func (m *ResourceService) SelectResource(q *models.ResourceRead) (*models.Resource, error) {
	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.ResourcesBadRequest()
	}

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

func checkResourceExist(code string) error {
	table := query.Resource

	_, err := table.Unscoped().Where(table.Code.Eq(code)).First()

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

func (m *ResourceService) UpdateResource(b *models.ResourceUpdateBody) (*models.Resource, error) {

	err := checkResourceExist(b.Code)

	if err != nil {
		return nil, err
	}

	table := query.Resource

	updateMap := b.ToUpdate()
	log.Println(len(updateMap))

	if len(updateMap) == 0 {
		return nil, problems.ResourcesBadRequest()
	}

	rows, err := table.Unscoped().Where(table.ID.Eq(b.ID)).Updates(updateMap)
	if err != nil {
		return nil, problems.ServerError()
	}

	if rows.RowsAffected == 0 {
		return nil, problems.ReadAccess()
	}

	resource, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()

	if err != nil {
		return nil, problems.ServerError()
	}

	return resource, nil
}
