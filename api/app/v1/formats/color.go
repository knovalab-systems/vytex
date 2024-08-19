package formats

import "github.com/knovalab-systems/vytex/app/v1/models"

func ColorUpdateMap(m *models.ColorUpdateBody) map[string]interface{} {
	updateMap := map[string]interface{}{}
	if m.Name != "" {
		updateMap["name"] = m.Name
	}

	if m.Hex != "" {
		updateMap["hex"] = m.Hex
	}

	if m.Code != "" {
		updateMap["code"] = m.Code
	}

	if !m.DeletedAt.IsNil() {
		if m.DeletedAt.IsNullDefined() {
			updateMap["deleted_at"] = nil
		} else {
			updateMap["deleted_at"] = m.DeletedAt.Value
		}

	}

	return updateMap
}
