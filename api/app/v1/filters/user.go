package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
)

func UserFilters(s query.IUserDo, filters string) (query.IUserDo, error) {

	table := query.User

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
					code, ok := v.(string)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.Name.Lower().Like("%"+code+"%"))
				}
			}
			s.Where(conditions...)
		case "username":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_contains":
					code, ok := v.(string)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.Username.Lower().Like("%"+code+"%"))
				}
			}
			s.Where(conditions...)
		case "role_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_in":
					idsInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					ids := formats.ConvertSlice[string](idsInterface)
					conditions = append(conditions, table.RoleId.In(ids...))
				}
			}
			s.Where(conditions...)
		case "delete_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, ok := v.(bool)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					if cond {
						conditions = append(conditions, table.DeletedAt.IsNull())
					} else {
						conditions = append(conditions, table.DeletedAt.IsNotNull())
					}
				}
			}
			s.Where(conditions...)
		}
	}

	return s, nil
}
