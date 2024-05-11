package utils

import (
	"log"
	"os"
	"strconv"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

func SanitizedQuery(req *models.Request) error {

	req.Limit = sanitizedLimit(req.Limit)

	req.Offset = sanitizeOffset(req.Offset, req.Page, req.Limit)

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

func sanitizedLimit(limit int) int {
	if limit == -1 { // here could be a max limit query
		return LimitQuery()
	}
	return limit
}

func sanitizeOffset(offset int, page int, limit int) int {
	if page > 0 {
		return limit * (page - 1)
	}
	return offset
}
