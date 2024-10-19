package filters

import (
	"encoding/json"

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
					name, err := formats.ConvertInterface[string](v)
					if err != nil {
						return nil, err
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
					code, err := formats.ConvertInterface[string](v)
					if err != nil {
						return nil, err
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
					ids, err := formats.ConvertSliceNumberInterface[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.ColorID.In(ids...))
				}
			}
			s.Where(conditions...)
		case "supplier_id":
			conditions := []gen.Condition{}
			for k, v := range value {
				switch k {
				case "_in":
					ids, err := formats.ConvertSliceNumberInterface[uint](v)
					if err != nil {
						return nil, err
					}
					conditions = append(conditions, table.SupplierID.In(ids...))
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
