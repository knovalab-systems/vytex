package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestToUpdateUser(t *testing.T) {
	t.Run("valid role", func(t *testing.T) {
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := UpdateUserBody{Role: role}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			v, ok := test["role"]
			assert.Equal(t, true, ok)
			assert.Equal(t, role, v)
		}
	})

	t.Run("valid deleted_at", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := Optional[time.Time]{Value: &detele_at, Defined: true}
		u := UpdateUserBody{DeletedAt: optional}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			v, ok := test["deleted_at"]
			assert.Equal(t, true, ok)
			assert.Equal(t, detele_at.String(), v.(*time.Time).String())
		}
	})

	t.Run("nil body", func(t *testing.T) {
		u := UpdateUserBody{}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {

			for k := range test {
				var ok bool
				_, ok = test[k]
				assert.Equal(t, false, ok)
			}
		}
	})

	t.Run("nil body", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := Optional[time.Time]{Value: &detele_at, Defined: true}
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := UpdateUserBody{DeletedAt: optional, Name: "name", Role: role, Username: "username", Password: "password"}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {

			for k := range test {
				var ok bool
				_, ok = test[k]
				assert.Equal(t, true, ok)
			}
		}
	})

}
