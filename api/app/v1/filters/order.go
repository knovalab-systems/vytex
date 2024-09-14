package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/pkg/query"
)

func OrderFilters(s query.IOrderDo, filters string) (query.IOrderDo, error) {

	if filters != "" {

		table := query.Order

		var filtersMap map[string]map[string]interface{}
		err := json.Unmarshal([]byte(filters), &filtersMap)
		if err != nil {
			return nil, err
		}

		for key, value := range filtersMap {
			switch key {
			case "status_id":
				for k, v := range value {
					switch k {
					case "_eq":
						id, ok := v.(float64)
						if !ok {
							return nil, errors.New("ERROR: INVALID TYPE")
						}
						s = s.Where(table.OrderStateID.Eq(uint(id)))
					}
				}
			}
		}

	}

	return s, nil

}
