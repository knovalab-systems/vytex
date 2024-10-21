package filters

import (
	"encoding/json"

	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gen"
	"gorm.io/gen/field"
)

func ReferenceFilters(s query.IReferenceDo, filters string) (query.IReferenceDo, error) {

	table := query.Reference

	var filtersMap map[string]map[string]interface{}
	err := json.Unmarshal([]byte(filters), &filtersMap)
	if err != nil {
		return nil, err
	}

	for key, value := range filtersMap {
		switch key {
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
				s.Where(conditions...)
			}
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
		case "colors":
			exprs := []field.Expr{query.ColorByReference.ReferenceID.EqCol(table.ID)}
			for k, v := range value {
				switch k {
				case "color_id":
					if v, ok := v.(map[string]interface{}); ok {
						for k, v := range v {
							switch k {
							case "_in":
								ids, err := formats.ConvertSliceNumberInterface[uint](v)
								if err != nil {
									return nil, err
								}
								exprs = append(exprs, query.ColorByReference.ColorID.In(ids...))

							}
						}
					}

				}
			}
			s = s.RightJoin(query.ColorByReference, exprs...)
		}
	}

	return s, nil

}
