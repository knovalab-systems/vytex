package filters

import (
	"encoding/json"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
)

func RoleFilters(s query.IRoleDo, filters string) (query.IRoleDo, error) {

	table := query.Role

	var filtersMap map[string]map[string]interface{}
	err := json.Unmarshal([]byte(filters), &filtersMap)
	if err != nil {
		return nil, err
	}

	for key, value := range filtersMap {
		switch key {
		case "name":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_contains":
					code, err := formats.ConvertInterface[string](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.Name.Lower().Like("%"+code+"%"))
				}
			}
			s.Where(conditions...)
		case "code":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, err := formats.ConvertInterface[bool](v)
					if err != nil {
						return nil, err
					}
					if cond {
						conditions = append(conditions, table.Code.Eq(""))
					} else {
						conditions = append(conditions, table.Code.Neq(""))
					}
				}
			}
			s.Where(conditions...)
		}
	}

	return s, nil
}
