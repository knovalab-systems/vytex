package services

import (
	"errors"
	"strings"

	"github.com/knovalab-systems/vytex/app/v1/aggregate"
	"github.com/knovalab-systems/vytex/app/v1/fields"
	"github.com/knovalab-systems/vytex/app/v1/filters"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/helpers"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"gorm.io/gorm"
)

type FabricService struct {
}

func (m *FabricService) SelectFabrics(q *models.Query) ([]*models.Fabric, error) {

	// sanitize
	formats.SanitizedQuery(q)

	// def query
	table := query.Fabric
	s := table.Unscoped()

	// def subquery
	table2 := table.As("u2")
	subQuery := table.Unscoped().
		Group(table.Track).
		Select(table.Track, table.ID.Max().As("id_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.FabricFields(s, q.Fields)
	}

	// filters
	if q.Filter != "" {
		var err error
		s, err = filters.FabricFilters(s, q.Filter)
		if err != nil {
			return nil, problems.ResourceBadRequest()
		}
	}

	// run query
	fabrics, err := s.Unscoped().LeftJoin(subQuery, table2.Track.EqCol(table.Track)).
		Where(field.NewInt64("u2", "id_max").EqCol(table.ID)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}

func (m *FabricService) SelectFabric(q *models.FabricRead) (*models.Fabric, error) {
	// sanitize
	formats.SanitizedQuery(&q.Query)

	// def query
	table := query.Fabric
	s := table.Unscoped().Limit(*q.Limit).Offset(q.Offset)

	// fields
	if q.Fields != "" {
		s = fields.FabricFields(s, q.Fields)
	}

	// run query
	fabric, err := s.Where(table.ID.Eq(q.ID)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, problems.ReadAccess()
		}
		return nil, problems.ServerError()
	}

	return fabric, nil
}

func (m *FabricService) AggregationFabrics(q *models.AggregateQuery) (*[]map[string]interface{}, error) {
	table := query.Fabric

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
		s, err = filters.FabricFilters(s, q.Filter)
		if err != nil {
			return nil, problems.FabricsBadRequest()
		}
	}

	if q.Count != "" {
		countArr = strings.Split(q.Count, ",")
		count = aggregate.ExprsCountFabric(countArr)
	}

	if q.GroupBy != "" {
		groupByArr := strings.Split(q.GroupBy, ",")
		groupBy := fields.FabricSwitch(groupByArr, func(s string) bool { return false })
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

func (m *FabricService) CreateFabric(b *models.FabricCreateBody) (*models.Fabric, error) {

	err := helpers.CheckFabricExists(b.Code)
	if err != nil {
		return nil, err
	}

	c, err := helpers.GetComposition(&b.Composition)
	if err != nil {
		return nil, err
	}

	fabric := &models.Fabric{
		Name:          b.Name,
		SupplierID:    b.Supplier,
		ColorID:       b.Color,
		Cost:          b.Cost,
		Code:          b.Code,
		CompositionID: c.ID,
	}

	err = query.Fabric.Create(fabric)
	if err != nil {
		return nil, err
	}

	return fabric, nil
}

func (m *FabricService) UpdateFabric(b *models.FabricUpdateBody) (*models.Fabric, error) {
	table := query.Fabric

	fabric, err := table.Unscoped().Where(table.ID.Eq(b.ID)).First()
	if err != nil {
		return nil, problems.ServerError()
	}

	hasChanges, err := formats.FabricUpdateVersion(b, fabric, helpers.GetComposition, helpers.CheckFabricExists)
	if err != nil {
		return nil, err
	}

	if hasChanges {
		fabric.ID = 0
		fabric.CreatedAt = nil
		err = table.Create(fabric)
		if err != nil {
			return nil, problems.ServerError()
		}
	}

	return fabric, nil
}
