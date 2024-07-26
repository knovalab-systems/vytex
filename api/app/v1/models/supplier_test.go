package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestToUpdateSupplier(t *testing.T) {
	t.Run("valid deleted_at", func(t *testing.T) {
		deleted_at, _ := time.Parse(time.RFC3339, "2022-1-09T14:09:53+00:00")
		optional := Optional[time.Time]{Value: &deleted_at, Defined: true}
		u := SupplierUpdateBody{DeletedAt: optional}

		test := u.ToUpdate()
		v, ok := test["deleted_at"]
		assert.Equal(t, true, ok)
		assert.Equal(t, deleted_at.String(), v.(*time.Time).String())
	})

	t.Run("nil body", func(t *testing.T) {
		u := SupplierUpdateBody{}

		test := u.ToUpdate()

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, false, ok)
		}
	})

	t.Run("full body", func(t *testing.T) {
		deleted_at, _ := time.Parse(time.RFC3339, "2022-1-09T14:09:53+00:00")
		optional := Optional[time.Time]{Value: &deleted_at, Defined: true}
		u := SupplierUpdateBody{DeletedAt: optional, Name: "test", Brand: "test", Nit: "test", Code: "test"}

		test := u.ToUpdate()

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, true, ok)
		}
	})

}
