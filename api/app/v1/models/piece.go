package models

type Piece struct {
	ID      uint   `json:"id,omitempty" gorm:"primary_key"`
	ImageID string `json:"image_id,omitempty"`
	Image   *Image `json:"image,omitempty"`
}
