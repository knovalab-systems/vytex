package filters

import (
	"encoding/json"

	"github.com/knovalab-systems/vytex/app/v1/formats"
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
		case "id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, err := formats.ConvertToNumber[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.ID.Eq(id))
				}
			}
			s.Where(conditions...)
		case "order_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, err := formats.ConvertToNumber[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.OrderID.Eq(id))
				}
			}
			s.Where(conditions...)
		case "task_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_eq":
					id, err := formats.ConvertToNumber[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.TaskID.Eq(id))
				case "_in":
					ids, err := formats.ConvertSliceNumberInterface[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.TaskID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "task_control_state_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_in":
					ids, err := formats.ConvertSliceNumberInterface[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.TaskControlStateID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "rejected_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, err := formats.ConvertInterface[bool](v)
					if err != nil {
						return nil, err
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
					cond, err := formats.ConvertInterface[bool](v)
					if err != nil {
						return nil, err
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
