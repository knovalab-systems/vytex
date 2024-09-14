package fields

import (
	"strings"

	"github.com/knovalab-systems/vytex/pkg/query"
)

func Fields(s interface{}, fields string) interface{} {

	if fields != "" {
		fieldsArr := strings.Split(fields, ",")

		switch s := s.(type) {
		case query.IOrderDo:
			return orderFields(s, fieldsArr)
		case query.IOrderStateDo:
			return orderStateFields(s, fieldsArr)
		}

	}

	return s
}
