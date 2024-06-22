package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Reference struct {
	ID        uint           `json:"id" gorm:"primary_key"`
	Key       string         `json:"key" gorm:"type:uuid"`
	Reference string         `json:"reference"`
	CreatedAt time.Time      `json:"create_at"`
	DeletedAt gorm.DeletedAt `json:"delete_at" gorm:"index"`
	CreatedBy string         `json:"create_by"`
	User      *User          `json:"user,omitempty" gorm:"foreignKey:CreatedBy"`
}

// BeforeCreate will set a UUID to key, if is not set
func (b *Reference) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Key) == 0 {
		b.Key = uuid.New().String()

	}
	return nil
}

type ColorByReference struct {
	ID          uint           `json:"id" gorm:"primary_key"`
	DeletedAt   gorm.DeletedAt `json:"delete_at" gorm:"index"`
	ColorID     uint           `json:"colorId"`
	Color       *Color         `json:"color,omitempty"`
	ReferenceID uint           `json:"referenceId"`
	Reference   *Reference     `json:"reference,omitempty"`
}

type ResourceByReference struct {
	ID                 uint              `json:"id" gorm:"primary_key"`
	Key                string            `json:"key" gorm:"type:uuid"`
	ColorByReferenceID uint              `json:"colorByReferenceId"`
	DeletedAt          gorm.DeletedAt    `json:"delete_at" gorm:"index"`
	ColorByReference   *ColorByReference `json:"colorByReference,omitempty" `
	ResourceId         uint              `json:"resourceId"`
	Resource           *Resource         `json:"resource,omitempty"`
	Sizes
}

// BeforeCreate will set a UUID to key, if is not set
func (b *ResourceByReference) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Key) == 0 {
		b.Key = uuid.New().String()

	}
	return nil
}

type FabricByReference struct {
	ID                 uint              `json:"id" gorm:"primary_key"`
	Key                string            `json:"key" gorm:"type:uuid"`
	ColorByReferenceID uint              `json:"colorByReferenceId"`
	DeletedAt          gorm.DeletedAt    `json:"delete_at" gorm:"index"`
	ColorByReference   *ColorByReference `json:"colorByReference,omitempty" `
	FabricId           uint              `json:"fabricId"`
	Fabric             *Fabric           `json:"fabric,omitempty"`
	Sizes
}

// BeforeCreate will set a UUID to key, if is not set
func (b *FabricByReference) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Key) == 0 {
		b.Key = uuid.New().String()

	}
	return nil
}

type ReferenceCreateBody struct {
	Reference string                   `json:"reference" validate:"required,gt=0"`
	Colors    []ColorByReferenceCreate `json:"colors" validate:"required,min=1,dive"`
}

type ColorByReferenceCreate struct {
	Color     uint                        `json:"color" validate:"required,gt=0"`
	Fabrics   []FabricByReferenceCreate   `json:"fabrics" validate:"required,min=1,dive"`
	Resources []ResourceByReferenceCreate `json:"resources" validate:"required,min=1,dive"`
}

type FabricByReferenceCreate struct {
	Fabric uint `json:"fabric" validate:"gt=0"`
	Sizes
}

type ResourceByReferenceCreate struct {
	Resource uint `json:"resource" validate:"gt=0"`
	Sizes
}
