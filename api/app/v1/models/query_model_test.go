package models

import (
	"testing"

	"github.com/knovalab-systems/vytex/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestSanitizedLimit(t *testing.T) {

	limitQuery := utils.LimitQuery()

	t.Run("set limit query, on -1", func(t *testing.T) {
		// context
		limit := -1
		// test
		result := sanitizedLimit(&limit)
		assert.Equal(t, limitQuery, *result)
	})

	t.Run("respect limit on limit > -1", func(t *testing.T) {
		// context
		limit := 10
		// test
		result := sanitizedLimit(&limit)
		assert.Equal(t, limit, *result)
	})

}

func TestSanitizedOffset(t *testing.T) {
	t.Run("set offset from page > 0", func(t *testing.T) {
		// context
		limit := 10
		offset := 10
		page := 1
		expect := limit * (page - 1)

		// test
		result := sanitizeOffset(offset, page, limit)
		assert.Equal(t, expect, result)
	})

	t.Run("avoid change offset", func(t *testing.T) {
		// context
		limit := 10
		offset := 10
		page := 0

		// test
		result := sanitizeOffset(offset, page, limit)
		assert.Equal(t, offset, result)
	})
}
