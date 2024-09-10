package formats

import (
	"testing"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/assert"
)

func TestToUpdateUser(t *testing.T) {

	t.Setenv("NO_ROLE", "739c8723-85c0-42d8-aef0-5de054890dee")
	t.Setenv("ADMIN_ROLE", "31b63ffb-15f5-48d7-9a24-587f437f07ec")
	t.Setenv("DESIGNER_ROLE", "b3c766e9-3d70-4f33-a816-b0cd6168da81")
	t.Run("valid role", func(t *testing.T) {
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := models.UserUpdateBody{Role: role}

		test, err := UserUpdateMap(&u)
		if assert.NoError(t, err) {
			v, ok := test["role_id"]
			assert.Equal(t, true, ok)
			assert.Equal(t, role, v)
		}
	})

	t.Run("valid deleted_at", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := models.Optional[time.Time]{Value: &detele_at, Defined: true}
		u := models.UserUpdateBody{DeletedAt: optional}

		test, err := UserUpdateMap(&u)
		if assert.NoError(t, err) {
			v, ok := test["deleted_at"]
			assert.Equal(t, true, ok)
			assert.Equal(t, detele_at.String(), v.(*time.Time).String())
		}
	})

	t.Run("nil body", func(t *testing.T) {
		u := models.UserUpdateBody{}

		test, err := UserUpdateMap(&u)
		if assert.NoError(t, err) {

			for k := range test {
				var ok bool
				_, ok = test[k]
				assert.Equal(t, false, ok)
			}
		}
	})

	t.Run("check fields body", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := models.Optional[time.Time]{Value: &detele_at, Defined: true}
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := models.UserUpdateBody{DeletedAt: optional, Name: "name", Role: role, Username: "username", Password: "password"}

		test, err := UserUpdateMap(&u)
		if assert.NoError(t, err) {

			for k := range test {
				var ok bool
				_, ok = test[k]
				assert.Equal(t, true, ok)
			}
		}
	})

}
