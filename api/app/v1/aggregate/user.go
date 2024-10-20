package aggregate

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen/field"
)

func CountUsers(s query.IUserDo, count []string) ([]*models.AggregateData, error) {

	a := []*models.AggregateData{}

	table := query.User

	for _, v := range count {

		countMap := map[string]int64{}
		aggregateElem := models.AggregateData{}

		switch v {
		case "id":
			count, err := s.Select(table.ID).Count()
			if err != nil {
				return nil, problems.ServerError()
			}
			countMap["id"] = count
		case "deleted_at":
			count, err := s.Select(table.DeletedAt).Count()
			if err != nil {
				return nil, problems.ServerError()
			}
			countMap["deleted_at"] = count
		default:
			count, err := s.Count()
			if err != nil {
				return nil, problems.ServerError()
			}
			aggregateElem.Count = count
		}

		if len(countMap) > 0 {
			aggregateElem.Count = countMap
		}

		a = append(a, &aggregateElem)
	}

	return a, nil
}

func CountUsersGroupBy(s query.IUserDo, count []string, groupBy []field.Expr) ([]*models.AggregateData, error) {

	table := query.User
	a := []*models.AggregateData{}

	for _, v := range count {

		countArr := []map[string]interface{}{}
		aggregateElem := models.AggregateData{}

		switch v {
		case "id":
			err := s.Select(append(groupBy, table.ID.Count().As("count"))...).Group(groupBy...).Scan(&countArr)
			if err != nil {
				return nil, err
			}
		case "deleted_at":
			err := s.Select(append(groupBy, table.DeletedAt.Count().As("count"))...).Group(groupBy...).Scan(&countArr)
			if err != nil {
				return nil, err
			}
		default:
			err := s.Select(append(groupBy, table.ID.Count().As("count"))...).Group(groupBy...).Scan(&countArr)
			if err != nil {
				return nil, err
			}
		}

		aggregateElem.Count = countArr
		a = append(a, &aggregateElem)
	}

	return a, nil
}
