package formats

import "github.com/knovalab-systems/vytex/app/v1/models"

func SupplierUpdateMap(s *models.SupplierUpdateBody) map[string]interface{} {
	updateMap := map[string]interface{}{}

	if s.Name != "" {
		updateMap["name"] = s.Name
	}

	if s.Brand != "" {
		updateMap["brand"] = s.Brand
	}

	if s.Nit != "" {
		updateMap["nit"] = s.Nit
	}

	if s.Code != "" {
		updateMap["code"] = s.Code
	}

	if !s.DeletedAt.IsNil() {
		if s.DeletedAt.IsNullDefined() {
			updateMap["deleted_at"] = nil
		} else {
			updateMap["deleted_at"] = s.DeletedAt.Value
		}

	}

	return updateMap
}
