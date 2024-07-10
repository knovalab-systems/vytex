package models

import (
	"github.com/knovalab-systems/vytex/pkg/envs"
)

type Query struct {
	Limit  *int   `query:"limit" validate:"omitnil,gte=-1"`
	Offset int    `query:"offset" validate:"gte=0"`
	Page   int    `query:"page" validate:"gte=0"`
	Filter string `query:"filter"`
	Fields string `query:"fields"`
}

func (m *Query) SanitizedQuery() error {

	m.Limit = sanitizedLimit(m.Limit)

	// need to be late than sanitizedLimit
	m.Offset = sanitizeOffset(m.Offset, m.Page, *m.Limit)

	return nil
}

func sanitizedLimit(limit *int) *int {
	if limit == nil {
		l := envs.LIMIT_QUERY()
		return &l
	}
	if *limit == -1 { // here could be a max limit query
		l := envs.LIMIT_QUERY()
		return &l
	}
	return limit
}

func sanitizeOffset(offset int, page int, limit int) int {
	if page > 0 {
		return limit * (page - 1)
	}
	return offset
}

type AggregateQuery struct {
	Count  string `query:"count"`
	Filter string `query:"filter"`
}
