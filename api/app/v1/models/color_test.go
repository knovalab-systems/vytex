package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestToUpdateColor(t *testing.T) {
	t.Run("valid deleted_at", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := Optional[time.Time]{Value: &detele_at, Defined: true}
		u := ColorUpdateBody{DeletedAt: optional}

		test := u.ToUpdate()
		v, ok := test["deleted_at"]
		assert.Equal(t, true, ok)
		assert.Equal(t, detele_at.String(), v.(*time.Time).String())
	})

	t.Run("nil body", func(t *testing.T) {
		u := ColorUpdateBody{}

		test := u.ToUpdate()

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, false, ok)
		}
	})

	t.Run("nil body", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := Optional[time.Time]{Value: &detele_at, Defined: true}
		u := ColorUpdateBody{DeletedAt: optional, Name: "name", Hex: "#000", Code: "code"}

		test := u.ToUpdate()

		for k := range test {
			var ok bool
			_, ok = test[k]
			assert.Equal(t, true, ok)
		}
	})

}
