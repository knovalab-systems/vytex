package models

type Task struct {
	ID     uint      `json:"id,omitempty" gorm:"primary_key"`
	Name   string    `json:"name,omitempty"`
	Value  TaskValue `json:"value,omitempty" gorm:"type:text"`
	StepID uint      `json:"step_id,omitempty"`
	Step   *Step     `json:"step,omitempty"`
}

type TaskValue string

const (
	Trazar             TaskValue = "trazar"
	Plantear           TaskValue = "plantear"
	Tender             TaskValue = "tender"
	Cortar             TaskValue = "cortar"
	Paquetear          TaskValue = "paquetear"
	Filetear           TaskValue = "filetear"
	ArmarEspalda       TaskValue = "armar espalda"
	TaparVarilla       TaskValue = "tapar varilla"
	FigurarAbrochadura TaskValue = "figurar abrochadura"
	CerrarCostado      TaskValue = "cerrar costado"
	MarquillaSesgar    TaskValue = "marquilla y sesgar"
	GafeteMangas       TaskValue = "gafete y mangas"
	Presillar          TaskValue = "presillar"
)

func DefaultTasks(steps map[StepValue]uint) []*Task {
	return []*Task{
		{Name: "Trazar", Value: Trazar, StepID: steps[Corte]},
		{Name: "Plantear", Value: Plantear, StepID: steps[Corte]},
		{Name: "Tender", Value: Tender, StepID: steps[Corte]},
		{Name: "Cortar", Value: Cortar, StepID: steps[Corte]},
		{Name: "Paquetear", Value: Paquetear, StepID: steps[Corte]},
		{Name: "Filetear", Value: Filetear, StepID: steps[Confeccion]},
		{Name: "Armar Espalda", Value: ArmarEspalda, StepID: steps[Confeccion]},
		{Name: "Tapar Varilla", Value: TaparVarilla, StepID: steps[Confeccion]},
		{Name: "Figurar Abrochadura", Value: FigurarAbrochadura, StepID: steps[Confeccion]},
		{Name: "Cerrar Costado", Value: CerrarCostado, StepID: steps[Confeccion]},
		{Name: "Marquilla y Sesgar", Value: MarquillaSesgar, StepID: steps[Confeccion]},
		{Name: "Gafete y Mangas", Value: GafeteMangas, StepID: steps[Confeccion]},
		{Name: "Presillar", Value: Presillar, StepID: steps[Confeccion]},
	}
}
