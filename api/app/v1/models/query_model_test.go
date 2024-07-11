package models

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/knovalab-systems/vytex/config"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func controller(c echo.Context) error {
	u := new(Query)

	// bind
	if err := c.Bind(u); err != nil {
		return problems.UsersBadRequest()
	}

	// validate
	if err := c.Validate(u); err != nil {
		return problems.UsersBadRequest()
	}

	return nil
}

func TestQueryInRequest(t *testing.T) {

	t.Run("Fail binding", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "uno")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// test
		err := controller(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, bad value for limit", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("limit", "-2")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// test
		err := controller(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})

	t.Run("Fail validation, bad value for page", func(t *testing.T) {
		// context
		q := make(url.Values)
		q.Set("page", "-1")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		e := echo.New()
		config.EchoValidator(e)
		c := e.NewContext(req, rec)

		// test
		err := controller(c)
		if assert.Error(t, err) {
			assert.Equal(t, http.StatusBadRequest, err.(*echo.HTTPError).Code)
		}
	})
}

func TestSanitizedLimit(t *testing.T) {

	limitQuery := envs.LIMIT_QUERY()

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
