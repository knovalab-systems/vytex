package utils

import (
	"log"
	"os"
	"strconv"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

func SanitizedQuery(req *models.Query) error {

	req.Limit = sanitizedLimit(req.Limit)

	// need to be late than sanitizedLimit
	req.Offset = sanitizeOffset(req.Offset, req.Page, *req.Limit)

	return nil
}

func LimitQuery() int {
	limit := 50
	env, exists := os.LookupEnv("QUERY_LIMIT_DEFAULT")
	if exists {
		limit, err := strconv.Atoi(env)
		if err != nil {
			log.Println("Invalid type in enviroment variable, QUERY_LIMIT_DEFAULT", err)
		} else {
			return limit
		}
	}
	return limit
}

func sanitizedLimit(limit *int) *int {
	if limit == nil {
		l := LimitQuery()
		return &l
	}
	if *limit == -1 { // here could be a max limit query
		l := LimitQuery()
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
