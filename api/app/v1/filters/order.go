package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
)

func OrderFilters(s query.IOrderDo, filters string) (query.IOrderDo, error) {

	table := query.Order

	var filtersMap map[string]map[string]interface{}
	err := json.Unmarshal([]byte(filters), &filtersMap)
	if err != nil {
		return nil, err
	}

	for key, value := range filtersMap {
		switch key {
		case "status_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, ok := v.(float64)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.OrderStateID.Eq(uint(id)))
				}
			}
			s.Where(conditions...)
		}
	}

	return s, nil
}
