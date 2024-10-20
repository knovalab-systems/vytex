package models

type OperationalList struct {
	ID          uint        `json:"id,omitempty" gorm:"primary_key"`
	ReferenceID uint        `json:"reference_id,omitempty"`
	Reference   *Reference  `json:"reference,omitempty"`
	Operations  []Operation `json:"operations,omitempty" gorm:"foreignKey:OperationalListID"`
}

type Operation struct {
	ID                uint             `json:"id,omitempty" gorm:"primary_key"`
	OperationalListID uint             `json:"operational_list_id,omitempty"`
	OperationalList   *OperationalList `json:"operational_list,omitempty"`
	Description       string           `json:"description,omitempty"`
}
