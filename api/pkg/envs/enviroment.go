package envs

import (
	"os"
)

func ENVIRONMENT() string {
	env, exists := os.LookupEnv("ENV")
	if !exists {
		return ""
	}
	return env
}
