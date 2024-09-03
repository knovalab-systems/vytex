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
		log.Fatalln("Env variable error, %w", errors.New("ADMIN_ROLE ENV was not found"))
	}
	return env
}

func DESIGNER_ROLE() string {
	env, exists := os.LookupEnv("DESIGNER_ROLE")
	if !exists {
		log.Fatalln("Env variable error, %w", errors.New("DESIGNER_ROLE ENV was not found"))
	}
	return env
}

func PRO_SUPERVISOR_ROLE() string {
	env, exists := os.LookupEnv("PRO_SUPERVISOR_ROLE")
	if !exists {
		log.Fatalln("Env variable error, %w", errors.New("PRO_SUPERVISOR_ROLE ENV was not found"))
	}
	return env
}
