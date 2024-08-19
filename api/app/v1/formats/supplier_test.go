package formats

import (
	"testing"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/assert"
)

func TestToUpdateSupplier(t *testing.T) {
	t.Run("valid deleted_at", func(t *testing.T) {
		deleted_at, _ := time.Parse(time.RFC3339, "2022-1-09T14:09:53+00:00")
		optional := models.Optional[time.Time]{Value: &deleted_at, Defined: true}
		u := models.SupplierUpdateBody{DeletedAt: optional}

		test := SupplierUpdateMap(&u)
		v, ok := test["deleted_at"]
		assert.Equal(t, true, ok)
		assert.Equal(t, deleted_at.String(), v.(*time.Time).String())
	})

	t.Run("nil body", func(t *testing.T) {
		u := models.SupplierUpdateBody{}

		test := SupplierUpdateMap(&u)

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, false, ok)
		}
	})

	t.Run("full body", func(t *testing.T) {
		deleted_at, _ := time.Parse(time.RFC3339, "2022-1-09T14:09:53+00:00")
		optional := models.Optional[time.Time]{Value: &deleted_at, Defined: true}
		u := models.SupplierUpdateBody{DeletedAt: optional, Name: "test", Brand: "test", Nit: "test", Code: "test"}

		test := SupplierUpdateMap(&u)

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, true, ok)
		}
	})

}
