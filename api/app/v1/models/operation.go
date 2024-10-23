package models

type Operation struct {
	ID          uint   `json:"id,omitempty" gorm:"primary_key"`
	Description string `json:"description,omitempty"`
}
