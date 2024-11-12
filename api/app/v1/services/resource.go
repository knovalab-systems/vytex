package services

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
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
	if q.Fields != "" {
		s = fields.ResourceFields(s, q.Fields)
	}

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
	if q.Fields != "" {
		s = fields.ResourceFields(s, q.Fields)
	}

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

func (m *ResourceService) AggregationResources(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	table := query.Resource

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("u2")

	s := table.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(field.NewInt64("u2", "id_max").EqCol(table.ID))

	count := []field.Expr{}
	countArr := []string{}

	a := &[]map[string]interface{}{}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.ResourceFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ResourceBadRequest()
		}
	}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountResource(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.ResourceSwitch(groupByArr, func(s string) bool { return false })
		err := s.Select(append(groupBy, count...)...).Group(groupBy...).Scan(a)
		if err != nil {
			return nil, problems.ServerError()
		}
		aggregate.AdjustSubfix(a, countArr)
		return a, nil
	}

	b := map[string]interface{}{}
	err := s.Select(count...).Scan(&b)
	if err != nil {
		return nil, problems.ServerError()
	}
	*a = append(*a, b)
	aggregate.AdjustSubfix(a, countArr)
	return a, nil
}

func (m *ResourceService) CreateResource(b *models.ResourceCreateBody) (*models.Resource, error) {
	err := helpers.CheckResourceExist(b.Code)
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

	hasChanges, err := formats.ResourceUpdateVersion(b, resource, helpers.CheckResourceExist)
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
