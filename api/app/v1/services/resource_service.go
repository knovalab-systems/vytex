package services

import (
	"strings"

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
		Group(table.Key).
		Select(table.Key, table.CreatedAt.Max().As("created_at_max")).
		As("table2").Limit(*q.Limit).Offset(q.Offset)

	// fields
	s = resourceFields(s, q.Fields)

	// run query
	resources, err := s.Unscoped().LeftJoin(subQuery, table2.Key.EqCol(table.Key)).
		Where(field.NewInt64("table2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return resources, nil
}

func (m *ResourceService) AggregationResources(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Resource
	s := table.Unscoped().Group(table.Key)
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

func resourceFields(s query.IResourceDo, fields string) query.IResourceDo {
	if fields != "" {
		table := query.Resource
		fieldsArr := strings.Split(fields, ",")
		f := []field.Expr{}

		for _, v := range fieldsArr {

			if strings.HasPrefix(v, "color.") {
				s = s.Preload(table.Color)
				continue
			}

			switch v {
			case "id":
				f = append(f, table.ID)
			case "key":
				f = append(f, table.Key)
			case "name":
				f = append(f, table.Name)
			case "cost":
				f = append(f, table.Cost)
			case "code":
				f = append(f, table.Code)
			case "color_id":
				f = append(f, table.ColorID)
			case "color":
				s = s.Preload(table.Color)
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
