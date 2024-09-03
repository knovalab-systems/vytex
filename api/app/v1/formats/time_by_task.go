package formats

import "github.com/knovalab-systems/vytex/app/v1/models"

func TimeByTaskDTOFormat(t models.TimeByTaskDTO) *models.TimeByTask {

	return &models.TimeByTask{
		Trazar:    &t.Trazar,
		Plantear:  &t.Plantear,
		Tender:    &t.Tender,
		Cortar:    &t.Cortar,
		Paquetear: &t.Paquetear,
		Filetear:  &t.Filetear,
		Armar:     &t.Armar,
		Tapar:     &t.Tapar,
		Figurar:   &t.Figurar,
		Marquilla: &t.Marquilla,
		Cerrar:    &t.Cerrar,
		Gafetes:   &t.Gafetes,
		Presillar: &t.Presillar,
		Pulir:     &t.Pulir,
		Revisar:   &t.Revisar,
		Acabados:  &t.Acabados,
		Bolsas:    &t.Bolsas,
		Tiquetear: &t.Tiquetear,
		Empacar:   &t.Empacar,
		Organizar: &t.Organizar,
		Grabar:    &t.Grabar,
		Paletizar: &t.Paletizar,
	}
}
