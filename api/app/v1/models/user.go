package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        string         `json:"id,omitempty" gorm:"type:uuid;primary_key;"`
	Username  string         `json:"username,omitempty"`
	Name      string         `json:"name,omitempty"`
	Password  string         `json:"password,omitempty"`
	Role      string         `json:"role,omitempty" gorm:"type:uuid"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	CreatedAt *time.Time     `json:"created_at,omitempty"`
	UpdatedAt *time.Time     `json:"updated_at,omitempty"`
}

// BeforeCreate will set a UUID
func (b *User) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()

	}
	if len(b.Role) == 0 {
		b.Role = envs.NO_ROLE()

	}
	return nil
}

// set password to *'s
func (b *User) AfterFind(tx *gorm.DB) (err error) {
	if len(b.Password) != 0 {
		b.Password = "*******"
	}
	return
}

type UserRead struct {
	ID string `param:"userId" validate:"required,uuid"`
	Query
}

type UpdateUserBody struct {
	ID        string              `param:"userId" validate:"required,uuid"`
	Username  string              `json:"username" validate:"omitempty,gt=0"`
	Name      string              `json:"name" validate:"omitempty,gt=0"`
	Password  string              `json:"password" validate:"omitempty,lte=20,gte=8"`
	Role      string              `json:"role" validate:"omitempty,uuid"`
	DeletedAt Optional[time.Time] `json:"deleted_at"`
}

func (m *UpdateUserBody) ToUpdate() (map[string]interface{}, error) {
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

type UserCreateBody struct {
	Username string `json:"username" validate:"required"`
	Name     string `json:"name" validate:"required"`
	Password string `json:"password" validate:"required,lte=20,gte=8"`
	Role     string `json:"role" validate:"uuid"`
}

type UserFilter struct {
	Name      string
	Username  string
	Role      string
	DeletedAt string
}
