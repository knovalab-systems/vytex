package formats

import (
	"testing"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/assert"
)

func TestTimeByTaskDTOFormat(t *testing.T) {

	t.Run("transform succesfully on empty", func(t *testing.T) {
		empty := models.TimeByTaskDTO{}

		timeByTask := TimeByTaskDTOFormat(empty)
		assert.NotEqual(t, timeByTask, nil)
		assert.Equal(t, *timeByTask.Acabados, uint(0))
		assert.Equal(t, *timeByTask.Armar, uint(0))
		assert.Equal(t, *timeByTask.Bolsas, uint(0))
		assert.Equal(t, *timeByTask.Cerrar, uint(0))
		assert.Equal(t, *timeByTask.Cortar, uint(0))
		assert.Equal(t, *timeByTask.Empacar, uint(0))
		assert.Equal(t, *timeByTask.Figurar, uint(0))
		assert.Equal(t, *timeByTask.Filetear, uint(0))
		assert.Equal(t, *timeByTask.Gafetes, uint(0))
		assert.Equal(t, *timeByTask.Grabar, uint(0))
		assert.Equal(t, *timeByTask.Marquilla, uint(0))
		assert.Equal(t, *timeByTask.Organizar, uint(0))
		assert.Equal(t, *timeByTask.Paletizar, uint(0))
		assert.Equal(t, *timeByTask.Paquetear, uint(0))
		assert.Equal(t, *timeByTask.Presillar, uint(0))
		assert.Equal(t, *timeByTask.Pulir, uint(0))
		assert.Equal(t, *timeByTask.Revisar, uint(0))
		assert.Equal(t, *timeByTask.Tapar, uint(0))
		assert.Equal(t, *timeByTask.Tender, uint(0))
		assert.Equal(t, *timeByTask.Tiquetear, uint(0))
		assert.Equal(t, *timeByTask.Trazar, uint(0))

	})

	t.Run("transform succesfully on some fields value", func(t *testing.T) {
		empty := models.TimeByTaskDTO{
			Armar:     12,
			Revisar:   12,
			Tiquetear: 24,
			Figurar:   32,
		}

		timeByTask := TimeByTaskDTOFormat(empty)
		assert.NotEqual(t, timeByTask, nil)
		assert.Equal(t, *timeByTask.Acabados, uint(0))
		assert.Equal(t, *timeByTask.Armar, uint(12))
		assert.Equal(t, *timeByTask.Bolsas, uint(0))
		assert.Equal(t, *timeByTask.Cerrar, uint(0))
		assert.Equal(t, *timeByTask.Cortar, uint(0))
		assert.Equal(t, *timeByTask.Empacar, uint(0))
		assert.Equal(t, *timeByTask.Figurar, uint(32))
		assert.Equal(t, *timeByTask.Filetear, uint(0))
		assert.Equal(t, *timeByTask.Gafetes, uint(0))
		assert.Equal(t, *timeByTask.Grabar, uint(0))
		assert.Equal(t, *timeByTask.Marquilla, uint(0))
		assert.Equal(t, *timeByTask.Organizar, uint(0))
		assert.Equal(t, *timeByTask.Paletizar, uint(0))
		assert.Equal(t, *timeByTask.Paquetear, uint(0))
		assert.Equal(t, *timeByTask.Presillar, uint(0))
		assert.Equal(t, *timeByTask.Pulir, uint(0))
		assert.Equal(t, *timeByTask.Revisar, uint(12))
		assert.Equal(t, *timeByTask.Tapar, uint(0))
		assert.Equal(t, *timeByTask.Tender, uint(0))
		assert.Equal(t, *timeByTask.Tiquetear, uint(24))
		assert.Equal(t, *timeByTask.Trazar, uint(0))

	})
}
