package models

type Size struct {
	XS2 float64 `json:"2XS,omitempty" validate:"omitempty,gte=0"`
	XS  float64 `json:"XS,omitempty" validate:"omitempty,gte=0"`
	S   float64 `json:"S,omitempty" validate:"omitempty,gte=0"`
	M   float64 `json:"M,omitempty" validate:"omitempty,gte=0"`
	L   float64 `json:"L,omitempty" validate:"omitempty,gte=0"`
	XL  float64 `json:"XL,omitempty" validate:"omitempty,gte=0"`
	XL2 float64 `json:"2XL,omitempty" validate:"omitempty,gte=0"`
	XL3 float64 `json:"3XL,omitempty" validate:"omitempty,gte=0"`
	XL4 float64 `json:"4XL,omitempty" validate:"omitempty,gte=0"`
	XL5 float64 `json:"5XL,omitempty" validate:"omitempty,gte=0"`
	XL6 float64 `json:"6XL,omitempty" validate:"omitempty,gte=0"`
	XL7 float64 `json:"7XL,omitempty" validate:"omitempty,gte=0"`
	XL8 float64 `json:"8XL,omitempty" validate:"omitempty,gte=0"`
}
