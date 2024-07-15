package models

type Size struct {
	XS2 float64 `json:"2XS" validate:"omitempty,gte=0"`
	XS  float64 `json:"XS" validate:"omitempty,gte=0"`
	S   float64 `json:"S" validate:"omitempty,gte=0"`
	M   float64 `json:"M" validate:"omitempty,gte=0"`
	L   float64 `json:"L" validate:"omitempty,gte=0"`
	XL  float64 `json:"XL" validate:"omitempty,gte=0"`
	XL2 float64 `json:"2XL" validate:"omitempty,gte=0"`
	XL3 float64 `json:"3XL" validate:"omitempty,gte=0"`
	XL4 float64 `json:"4XL" validate:"omitempty,gte=0"`
	XL5 float64 `json:"5XL" validate:"omitempty,gte=0"`
	XL6 float64 `json:"6XL" validate:"omitempty,gte=0"`
	XL7 float64 `json:"7XL" validate:"omitempty,gte=0"`
	XL8 float64 `json:"8XL" validate:"omitempty,gte=0"`
}
