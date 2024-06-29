package services

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
	"regexp"
	"strings"
)

type FabricService struct {
}

func (m *FabricService) SelectFabrics(q *models.Query) ([]*models.Fabric, error) {

	// sanitize
	if err := q.SanitizedQuery(); err != nil {
		return nil, problems.FabricBadRequest()
	}

	// def query
	table := query.Fabric
	table2 := table.As("u2")
	s := table.Unscoped()

	// def subquery
	subQuery := table.Unscoped().
		Group(table.Key).
		Select(table.Key, table.CreatedAt.Max().As("created_at_max")).
		As("u2").Limit(*q.Limit).Offset(q.Offset)

	// run query
	fabrics, err := s.Unscoped().LeftJoin(subQuery, table2.Key.EqCol(table.Key)).
		Where(field.NewInt64("u2", "created_at_max").EqCol(table.CreatedAt)).
		Find()
	if err != nil {
		return nil, problems.ServerError()
	}

	return fabrics, nil
}

func (m *FabricService) AggregationFabrics(q *models.AggregateQuery) ([]*models.AggregateData, error) {
	table := query.Fabric
	s := table.Unscoped().Group(table.Key)
	aggregateElem := models.AggregateData{Count: nil}

	if q.Count != "" {
		re := regexp.MustCompile(`[\[\]]`)
		countArr := strings.Split(re.ReplaceAllString(q.Count, ""), ",")
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
