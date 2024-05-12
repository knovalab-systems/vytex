package utils

import (
	"log"
	"os"
)

func NoRole() string {
	env, exists := os.LookupEnv("NO_ROLE")
	if !exists {
		log.Panic("Invalid type in enviroment variable, NO_ROLE")
	}
	return env
}
