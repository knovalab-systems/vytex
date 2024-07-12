package models

import "github.com/google/uuid"

func IsRole(role string) bool {

	if err := uuid.Validate(role); err != nil {
		return false
	}

	return true
}
