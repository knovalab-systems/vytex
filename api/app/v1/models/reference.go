package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Reference struct {
	ID           uint               `json:"id,omitempty" gorm:"primary_key"`
	Code         string             `json:"code,omitempty"`
	CreatedAt    *time.Time         `json:"created_at,omitempty"`
	DeletedAt    *gorm.DeletedAt    `json:"deleted_at,omitempty" gorm:"index"`
	CreatedBy    string             `json:"created_by,omitempty"`
	Track        string             `json:"track,omitempty" gorm:"type:uuid"`
	User         *User              `json:"user,omitempty" gorm:"foreignKey:CreatedBy"`
	Front        string             `json:"front,omitempty"`
	FrontImage   *Image             `json:"front_image,omitempty" gorm:"foreignKey:Front"`
	Back         string             `json:"back,omitempty"`
	BackImage    *Image             `json:"back_image,omitempty" gorm:"foreignKey:Back"`
	TimeByTaskID uint               `json:"time_by_task_id,omitempty"`
	TimeByTask   *TimeByTask        `json:"time_by_task,omitempty"`
	Colors       []ColorByReference `json:"colors,omitempty"`
	Pieces       []Piece            `json:"pieces,omitempty" gorm:"many2many:reference_pieces"`
	Operations   []Operation        `json:"operations,omitempty" gorm:"many2many:reference_operations"`
}

// BeforeCreate will set a UUID
func (b *Reference) BeforeCreate(tx *gorm.DB) (err error) {
	if b.Track == "" {
		b.Track = uuid.New().String()
	}
	return nil
}

type ColorByReference struct {
	ID          uint                  `json:"id,omitempty" gorm:"primary_key"`
	CreatedAt   *time.Time            `json:"created_at,omitempty"`
	DeletedAt   *gorm.DeletedAt       `json:"deleted_at,omitempty" gorm:"index"`
	ColorID     uint                  `json:"color_id,omitempty"`
	Color       *Color                `json:"color,omitempty"`
	ReferenceID uint                  `json:"reference_id,omitempty"`
	Reference   *Reference            `json:"reference,omitempty"`
	Resources   []ResourceByReference `json:"resources,omitempty"`
	Fabrics     []FabricByReference   `json:"fabrics,omitempty"`
}

type ResourceByReference struct {
	ID                 uint           `json:"id,omitempty" gorm:"primary_key"`
	Code               string         `json:"code,omitempty" gorm:"type:uuid"`
	DeletedAt          gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	ColorByReferenceID uint           `json:"color_by_reference_id,omitempty"`
	ResourceId         uint           `json:"resource_id,omitempty"`
	Resource           *Resource      `json:"resource,omitempty"`
	Size
}

// BeforeCreate will set a UUID to key, if is not set
func (b *ResourceByReference) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Code) == 0 {
		b.Code = uuid.New().String()
	}
	return nil
}

type FabricByReference struct {
	ID                 uint           `json:"id,omitempty" gorm:"primary_key"`
	Code               string         `json:"code,omitempty" gorm:"type:uuid"`
	DeletedAt          gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	ColorByReferenceID uint           `json:"color_by_reference_id,omitempty"`
	FabricId           uint           `json:"fabric_id,omitempty"`
	Fabric             *Fabric        `json:"fabric,omitempty"`
	Size
}

// BeforeCreate will set a UUID to key, if is not set
func (b *FabricByReference) BeforeCreate(tx *gorm.DB) (err error) {
	if len(b.Code) == 0 {
		b.Code = uuid.New().String()

	}
	return nil
}

type ReferenceCreateBody struct {
	Code       string                   `json:"code" validate:"required"`
	Front      string                   `json:"front" validate:"required,uuid"`
	Back       string                   `json:"back" validate:"required,uuid"`
	Colors     []ColorByReferenceCreate `json:"colors" validate:"required,min=1,dive"`
	Pieces     []PieceByReferenceCreate `json:"pieces" validate:"required,min=1,dive"`
	Operations []OperationCreate        `json:"operations" validate:"required,min=1,dive"`
	CreatedBy  string                   `json:"create_by" validate:"required,uuid"`
}

type OperationCreate struct {
	Description string `json:"description" validate:"required"`
}

type PieceByReferenceCreate struct {
	Image string `json:"image_id" validate:"required,uuid"`
}

type ColorByReferenceCreate struct {
	Color     uint                        `json:"color_id" validate:"required,gt=0"`
	Fabrics   []FabricByReferenceCreate   `json:"fabrics" validate:"required,min=1,dive"`
	Resources []ResourceByReferenceCreate `json:"resources" validate:"required,min=1,dive"`
}

type FabricByReferenceCreate struct {
	Fabric uint `json:"fabric_id" validate:"required,gt=0"`
	Size
}

type ResourceByReferenceCreate struct {
	Resource uint `json:"resource_id" validate:"required,gt=0"`
	Size
}

type TimeByTaskReferenceUpdate struct {
	ID         uint          `param:"referenceId" validate:"required"`
	TimeByTask TimeByTaskDTO `json:"time_by_task"`
}

type ReferenceRead struct {
	ID uint `param:"referenceId" validate:"required"`
	Query
}
