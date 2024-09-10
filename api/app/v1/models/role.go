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
	Code     string        `json:"code,omitempty"`
	Policies pq.Int64Array `json:"policies,omitempty" gorm:"type:integer[]"`
}

// BeforeCreate will set a UUID
func (b *Role) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()
	}
	return nil
}

const (
	ADMIN_ROLE_NAME          = "Administrador"
	DESIGNER_ROLE_NAME       = "Diseñadora"
	PRO_SUPERVISOR_ROLE_NAME = "Supervisor producción"
)

func ADMIN_ROLE() *Role {
	return &Role{
		Name:    ADMIN_ROLE_NAME,
		IsAdmin: true,
		Code:    "admin",
		Policies: []int64{
			int64(ReadUsers),
			int64(CreateUsers),
			int64(UpdateUsers),
			int64(ReadSuppliers),
			int64(CreateSuppliers),
			int64(UpdateSuppliers),
			int64(ReadCustoms),
			int64(CreateCustoms),
			int64(CreateOrders),
			int64(ReadFabrics),
		},
	}
}

func DESIGNER_ROLE() *Role {
	return &Role{
		Name: DESIGNER_ROLE_NAME,
		Code: "desginer",
		Policies: []int64{
			int64(ReadColors),
			int64(CreateColors),
			int64(UpdateColors),
			int64(ReadFabrics),
			int64(CreateFabrics),
			int64(UpdateFabrics),
			int64(ReadResources),
			int64(CreateResources),
			int64(UpdateResources),
			int64(ReadReferences),
			int64(CreateReferences),
		},
	}
}

func PRO_SUPERVISOR_ROLE() *Role {
	return &Role{
		Name: PRO_SUPERVISOR_ROLE_NAME,
		Code: "propsupervisor",
		Policies: []int64{
			int64(ReadReferences),
			int64(UpdateTimesReferences),
		},
	}
}
