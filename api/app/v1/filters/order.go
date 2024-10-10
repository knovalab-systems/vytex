package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/formats"
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
		case "order_state_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, ok := v.(float64)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.OrderStateID.Eq(uint(id)))
				case "_in":
					idsInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					ids := formats.ConvertSliceUint(idsInterface)
					conditions = append(conditions, table.OrderStateID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "created_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_between":
					stringInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					times, err := formats.ConvertSliceTime(stringInterface)
					if err != nil {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.CreatedAt.Between(times[0], times[1]))
				}
			}
			s.Where(conditions...)
		case "started_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_between":
					stringInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					times, err := formats.ConvertSliceTime(stringInterface)
					if err != nil {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.StartedAt.Between(times[0], times[1]))
				}
			}
			s.Where(conditions...)
		case "canceled_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_between":
					stringInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					times, err := formats.ConvertSliceTime(stringInterface)
					if err != nil {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.CanceledAt.Between(times[0], times[1]))
				}
			}
			s.Where(conditions...)
		case "finished_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_between":
					stringInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					times, err := formats.ConvertSliceTime(stringInterface)
					if err != nil {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.FinishedAt.Between(times[0], times[1]))
				}
			}
			s.Where(conditions...)
		}

	}

	return s, nil
}
