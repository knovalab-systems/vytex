package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
)

func TaskControlFilters(s query.ITaskControlDo, filters string) (query.ITaskControlDo, error) {

	table := query.TaskControl

	var filtersMap map[string]map[string]interface{}
	err := json.Unmarshal([]byte(filters), &filtersMap)
	if err != nil {
		return nil, err
	}

	for key, value := range filtersMap {
		switch key {
		case "task_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, ok := v.(float64)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.TaskID.Eq(uint(id)))
				case "_in":
					idsFloat, ok := v.([]float64)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					ids := []uint{}
					for _, v := range idsFloat {
						ids = append(ids, uint(v))
					}
					conditions = append(conditions, table.TaskID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "rejected_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, ok := v.(bool)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					if cond {
						conditions = append(conditions, table.RejectedAt.IsNull())
					} else {
						conditions = append(conditions, table.RejectedAt.IsNotNull())
					}
				}
			}
			s.Where(conditions...)
		case "finished_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, ok := v.(bool)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					if cond {
						conditions = append(conditions, table.FinishedAt.IsNull())
					} else {
						conditions = append(conditions, table.FinishedAt.IsNotNull())
					}
				}
			}
			s.Where(conditions...)
		}
	}

	return s, nil
}
