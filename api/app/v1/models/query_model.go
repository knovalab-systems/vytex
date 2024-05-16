package models

import "github.com/knovalab-systems/vytex/pkg/utils"

type Query struct {
	Limit  *int   `query:"limit" validate:"omitnil,gte=-1"`
	Offset int    `query:"offset" validate:"gte=0"`
	Page   int    `query:"page" validate:"gte=0"`
	Filter string `query:"filter"`
}

type UserFilter struct {
	Name     string
	Username string
	Role     string
	DeleteAt string
}

func (m *Query) SanitizedQuery() error {

	m.Limit = sanitizedLimit(m.Limit)

	// need to be late than sanitizedLimit
	m.Offset = sanitizeOffset(m.Offset, m.Page, *m.Limit)

	return nil
}

func sanitizedLimit(limit *int) *int {
	if limit == nil {
		l := utils.LimitQuery()
		return &l
	}
	if *limit == -1 { // here could be a max limit query
		l := utils.LimitQuery()
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
	Count string `query:"count"`
}
