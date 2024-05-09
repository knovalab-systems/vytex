package utils

import (
	"log"
	"os"
	"strconv"

	"github.com/knovalab-systems/vytex/app/v1/models"
)

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

func SanitizedQuery(req *models.Request) error {

	// set max value limite - PROPOSITION
	req.Limit = sanitizedLimit(req.Limit)

	req.Offset = sanitizeOffset(req.Offset, req.Offset, req.Limit)

	return nil
}

func sanitizedLimit(limit int) int {
	if limit == -1 {
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
