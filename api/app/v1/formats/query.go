package formats

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
)

func SanitizedQuery(m *models.Query) {

	m.Limit = sanitizedLimit(m.Limit)

	// need to be late than sanitizedLimit
	m.Offset = sanitizeOffset(m.Offset, m.Page, *m.Limit)

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
