package filters

import (
	"encoding/json"
	"errors"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
)

func FabricFilters(s query.IFabricDo, filters string) (query.IFabricDo, error) {

	table := query.Fabric

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
					name, ok := v.(string)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.Name.Lower().Like("%"+name+"%"))
				}
			}
			s.Where(conditions...)
		case "code":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_contains":
					code, ok := v.(string)
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					conditions = append(conditions, table.Code.Lower().Like("%"+code+"%"))
				}
			}
			s.Where(conditions...)
		case "color_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_in":
					idsInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					ids := formats.ConvertSliceUint(idsInterface)
					conditions = append(conditions, table.ColorID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "supplier_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_in":
					idsInterface, ok := v.([]interface{})
					if !ok {
						return nil, errors.New("ERROR: INVALID TYPE")
					}
					ids := formats.ConvertSliceUint(idsInterface)
					conditions = append(conditions, table.SupplierID.In(ids...))
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
