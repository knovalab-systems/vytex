package envs

import (
	"errors"
	"log"
	"os"
)

func NO_ROLE() string {
	env, exists := os.LookupEnv("NO_ROLE")
	if !exists {
		log.Fatalln("Env variable error, %w", errors.New("NO_ROLE ENV was not found"))
	}
	return env
}

func ADMIN_ROLE() string {
	env, exists := os.LookupEnv("ADMIN_ROLE")
	if !exists {
		log.Fatalln("Env variable error, %w", errors.New("NO_ROLE ENV was not found"))
	}
	return env
}

func DESIGNER_ROLE() string {
	env, exists := os.LookupEnv("DESIGNER_ROLE")
	if !exists {
		log.Fatalln("Env variable error, %w", errors.New("NO_ROLE ENV was not found"))
	}
	return env
}
