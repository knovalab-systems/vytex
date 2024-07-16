package models

type Composition struct { // 10000 = 100.00%
	ID     uint `json:"id,omitempty" gorm:"primary_key"`
	Algod  uint `json:"algod,omitempty" validate:"omitempty,gte=0,max=10000"`
	Elast  uint `json:"elast,omitempty" validate:"omitempty,gte=0,max=10000"`
	Lino   uint `json:"lino,omitempty" validate:"omitempty,gte=0,max=10000"`
	Nylon  uint `json:"nylon,omitempty" validate:"omitempty,gte=0,max=10000"`
	Polye  uint `json:"polye,omitempty" validate:"omitempty,gte=0,max=10000"`
	Rayon  uint `json:"rayon,omitempty" validate:"omitempty,gte=0,max=10000"`
	Rayvis uint `json:"rayvis,omitempty" validate:"omitempty,gte=0,max=10000"`
	Tencel uint `json:"tencel,omitempty" validate:"omitempty,gte=0,max=10000"`
	Visco  uint `json:"visco,omitempty" validate:"omitempty,gte=0,max=10000"`
	Hilom  uint `json:"hilom,omitempty" validate:"omitempty,gte=0,max=10000"`
}
