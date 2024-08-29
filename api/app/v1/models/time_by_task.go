package models

type TimeByTask struct { // 10000 = 100.00%
	ID        uint `json:"id,omitempty" gorm:"primary_key"`
	Trazar    uint `json:"trazar,omitempty" validate:"omitempty,gte=0"`
	Plantear  uint `json:"plantear,omitempty" validate:"omitempty,gte=0"`
	Tender    uint `json:"tender,omitempty" validate:"omitempty,gte=0"`
	Cortar    uint `json:"cortar,omitempty" validate:"omitempty,gte=0"`
	Paquetear uint `json:"paquetear,omitempty" validate:"omitempty,gte=0"`
	Filetear  uint `json:"filetear,omitempty" validate:"omitempty,gte=0"`
	Armar     uint `json:"armar,omitempty" validate:"omitempty,gte=0"`
	Tapar     uint `json:"tapar,omitempty" validate:"omitempty,gte=0"`
	Figurar   uint `json:"figurar,omitempty" validate:"omitempty,gte=0"`
	Marquilla uint `json:"marquilla,omitempty" validate:"omitempty,gte=0"`
	Cerrar    uint `json:"cerrar,omitempty" validate:"omitempty,gte=0"`
	Gafetes   uint `json:"gafetes,omitempty" validate:"omitempty,gte=0"`
	Presillar uint `json:"presillar,omitempty" validate:"omitempty,gte=0"`
	Pulir     uint `json:"pulir,omitempty" validate:"omitempty,gte=0"`
	Revisar   uint `json:"revisar,omitempty" validate:"omitempty,gte=0"`
	Acabados  uint `json:"acabados,omitempty" validate:"omitempty,gte=0"`
	Bolsas    uint `json:"bolsas,omitempty" validate:"omitempty,gte=0"`
	Tiquetear uint `json:"tiquetear,omitempty" validate:"omitempty,gte=0"`
	Empacar   uint `json:"empacar,omitempty" validate:"omitempty,gte=0"`
	Organizar uint `json:"organizar,omitempty" validate:"omitempty,gte=0"`
	Grabar    uint `json:"grabar,omitempty" validate:"omitempty,gte=0"`
	Paletizar uint `json:"paletizar,omitempty" validate:"omitempty,gte=0"`
}
