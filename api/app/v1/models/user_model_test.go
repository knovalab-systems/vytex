package models

import (
	"testing"

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

	testCases := []struct {
		Role string
	}{
		{Role: "739c8723-85c0-42d8-aef0-5de054890dee"},
	}

	for i := range errorTestCases {
		testCase := testCases[i]

		t.Run("valid role", func(t *testing.T) {
			u := UpdateUserBody{Role: &testCase.Role}

			test, err := u.ToUpdate()
			if assert.NoError(t, err) {
				v, ok := test["role"]
				assert.Equal(t, true, ok)
				assert.Equal(t, testCase.Role, v)
			}
		})

	}

	t.Run("nil body", func(t *testing.T) {
		u := UpdateUserBody{}

		test, err := u.ToUpdate()
		if assert.NoError(t, err) {
			_, ok := test["role"]
			assert.Equal(t, false, ok)
		}
	})

}
