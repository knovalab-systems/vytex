package utils

import (
	"log"
	"os"
	"strconv"
)

func LimitQuery() int {
	limit := 50
	env, exists := os.LookupEnv("QUERY_LIMIT_DEFAULT")
	if exists {
		limit, err := strconv.Atoi(env)
		if err != nil {
			log.Fatal("Invalid type in enviroment variable, QUERY_LIMIT_DEFAULT", err)
		} else {
			return limit
		}
	}
	return limit
}
