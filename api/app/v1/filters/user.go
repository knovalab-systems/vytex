package filters

import (
	"encoding/json"

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
					code, err := formats.ConvertInterface[string](v)
					if err != nil {
						return nil, err
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
					code, err := formats.ConvertInterface[string](v)
					if err != nil {
						return nil, err
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
					ids, err := formats.ConvertSliceInterface[string](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.RoleId.In(ids...))
				}
			}
			s.Where(conditions...)
		case "delete_at":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_null":
					cond, err := formats.ConvertInterface[bool](v)
					if err != nil {
						return nil, err
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
