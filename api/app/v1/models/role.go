package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// User roles
type Role struct {
	ID       string         `json:"id,omitempty" gorm:"type:uuid;primary_key;"`
	Name     string         `json:"name,omitempty"`
	Code     RoleCode       `json:"code,omitempty"`
	Policies pq.StringArray `json:"policies,omitempty" gorm:"type:text[]"`
}

// BeforeCreate will set a UUID
func (b *Role) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.ID) == 0 {
		b.ID = uuid.New().String()
	}
	return nil
}

type RoleRead struct {
	ID string `param:"roleId" validate:"required,uuid"`
	Query
}

type RoleCreateBody struct {
	Name     string   `json:"name" validate:"required"`
	Policies []string `json:"policies" validate:"required,min=1"`
}

type RoleUpdateBody struct {
	ID       string   `param:"roleId" validate:"required,uuid"`
	Name     string   `json:"name"`
	Policies []string `json:"policies" validate:"omitempty,min=1"`
}

type RoleCode string

const (
	ADMIN_VALUE            RoleCode = "admin"
	DESIGNER_VALUE         RoleCode = "designer"
	PRO_SUPERVISOR_VALUE   RoleCode = "propsupervisor"
	CORTE_SUPERVISOR_VALUE RoleCode = "cortepsupervisor"
)

func DefaultRoles() []*Role {
	return []*Role{
		{
			Code: ADMIN_VALUE,
			Name: "Administrador",
			Policies: []string{
				string(ReadUsers),
				string(CreateUsers),
				string(UpdateUsers),
				string(ReadRoles),
				string(ReadSuppliers),
				string(CreateSuppliers),
				string(UpdateSuppliers),
				string(ReadCustoms),
				string(CreateCustoms),
				string(CreateOrders),
				string(ReadFabrics),
				string(ReadResources),
				string(ReadOrders),
				string(CreateRoles),
				string(UpdateRoles),
			},
		},
		{
			Name: "Diseñadora",
			Code: DESIGNER_VALUE,
			Policies: []string{
				string(ReadColors),
				string(CreateColors),
				string(UpdateColors),
				string(ReadFabrics),
				string(CreateFabrics),
				string(UpdateFabrics),
				string(ReadResources),
				string(CreateResources),
				string(UpdateResources),
				string(ReadReferences),
				string(CreateReferences),
			},
		},
		{
			Name: "Supervisor producción",
			Code: PRO_SUPERVISOR_VALUE,
			Policies: []string{
				string(ReadReferences),
				string(UpdateTimesReferences),
				string(ReadOrders),
				string(StartOrder),
			},
		},
		{
			Name: "Supervisor corte",
			Code: CORTE_SUPERVISOR_VALUE,
			Policies: []string{
				string(ReadReferences),
				string(ReadCorte),
				string(UpdateCorte),
			},
		},
	}
}
