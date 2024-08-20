package formats

import (
	"errors"

	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"golang.org/x/crypto/bcrypt"
)

func UserUpdateMap(m *models.UserUpdateBody) (map[string]interface{}, error) {
	updateMap := map[string]interface{}{}

	if m.Role != "" {
		if !IsRole(m.Role) {
			return nil, errors.New("INVALID ROLE")
		}
		updateMap["role"] = m.Role
	}

	if m.Username != "" {
		updateMap["username"] = m.Username
	}

	if m.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(m.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, errors.New("ENCRYPT ERROR")
		}
		updateMap["password"] = hashedPassword
	}

	if m.Name != "" {
		updateMap["name"] = m.Name
	}

	if !m.DeletedAt.IsNil() {
		if m.DeletedAt.IsNullDefined() {
			updateMap["deleted_at"] = nil
		} else {
			updateMap["deleted_at"] = m.DeletedAt.Value
		}

	}

	return updateMap, nil
}

func IsRole(role string) bool {

	if err := uuid.Validate(role); err != nil {
		return false
	}

	return true
}
