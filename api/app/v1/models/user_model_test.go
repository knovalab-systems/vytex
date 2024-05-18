package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestToUpdate(t *testing.T) {
	errorTestCases := []struct {
		Role string
	}{
		{Role: ""},
	}

	for i := range errorTestCases {
		errorTestCase := errorTestCases[i]

		t.Run("empty role string", func(t *testing.T) {
			u := UpdateUserBody{Role: &errorTestCase.Role}

			_, err := u.ToUpdate()
			assert.Error(t, err)
		})

	}

	t.Run("valid role", func(t *testing.T) {
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := UpdateUserBody{Role: &role}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			v, ok := test["role"]
			assert.Equal(t, true, ok)
			assert.Equal(t, role, v)
		}
	})

	t.Run("valid delete_at", func(t *testing.T) {
		detele_at, _ := time.Parse(time.RFC3339, "2020-12-09T16:09:53+00:00")
		optional := Optional[time.Time]{Value: &detele_at, Defined: true}
		u := UpdateUserBody{DeleteAt: optional}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			v, ok := test["delete_at"]
			assert.Equal(t, true, ok)
			assert.Equal(t, detele_at.String(), v.(*time.Time).String())
		}
	})

	t.Run("nil body", func(t *testing.T) {
		u := UpdateUserBody{}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			var ok bool
			_, ok = test["role"]
			assert.Equal(t, false, ok)
			_, ok = test["delete_at"]
			assert.Equal(t, false, ok)
		}
	})

}

func TestCreateUserBody(t *testing.T) {
	t.Run("Valid user body", func(t *testing.T) {
		role := "739c8723-85c0-42d8-aef0-5de054890dee"
		u := CreateUserBody{Username: "test", Name: "test", Password: "test", Role: &role}

		_, err := u.Validate()
		assert.NoError(t, err)
	})

	t.Run("Empty username", func(t *testing.T) {
		u := CreateUserBody{Username: "", Name: "test", Password: "test"}

		_, err := u.Validate()
		assert.Error(t, err)
	})

	t.Run("Empty name", func(t *testing.T) {
		u := CreateUserBody{Username: "test", Name: "", Password: "test"}

		_, err := u.Validate()
		assert.Error(t, err)
	})

	t.Run("Empty password", func(t *testing.T) {
		u := CreateUserBody{Username: "test", Name: "test", Password: ""}

		_, err := u.Validate()
		assert.Error(t, err)
	})

	t.Run("Invalid role", func(t *testing.T) {
		role := "invalid_role"
		u := CreateUserBody{Username: "test", Name: "test", Password: "test", Role: &role}

		_, err := u.Validate()
		assert.Error(t, err)
	})
}
