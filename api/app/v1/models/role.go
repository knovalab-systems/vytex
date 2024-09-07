package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// User roles
type Role struct {
	ID       string        `json:"id,omitempty" gorm:"type:uuid;primary_key;"`
	Name     string        `json:"name,omitempty"`
	IsAdmin  bool          `json:"is_admin,omitempty"`
	Static   bool          `json:"static,omitempty"`
	Policies pq.Int64Array `json:"policies,omitempty" gorm:"type:integer[]"`
}

// BeforeCreate will set a UUID
func (b *Role) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()
	}
	return nil
}

type Policie int64

const (
	ReadUsers Policie = iota
	UpdateUsers
	CreateUsers
)

const (
	ADMIN_ROLE_NAME          = "Administrador"
	DESIGNER_ROLE_NAME       = "Diseñadora"
	PRO_SUPERVISOR_ROLE_NAME = "Supervisor producción"
)

func ADMIN_ROLE() *Role {
	return &Role{
		Name:    ADMIN_ROLE_NAME,
		IsAdmin: true,
		Static:  true,
		Policies: []int64{
			(int64)(ReadUsers),
			(int64)(UpdateUsers),
			(int64)(CreateUsers),
		},
	}
}

func DESIGNER_ROLE() *Role {
	return &Role{
		Name:     DESIGNER_ROLE_NAME,
		Static:   true,
		Policies: []int64{},
	}
}

func PRO_SUPERVISOR_ROLE() *Role {
	return &Role{
		Name:     PRO_SUPERVISOR_ROLE_NAME,
		Static:   true,
		Policies: []int64{},
	}
}
