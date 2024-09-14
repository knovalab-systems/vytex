package envs

import (
	"os"
)

func ADMIN_PASSWORD_DEFAULT() string {
	env, exists := os.LookupEnv("ADMIN_PASSWORD_DEFAULT")
	if exists {
		return env
	}
	return "Password123"
}
