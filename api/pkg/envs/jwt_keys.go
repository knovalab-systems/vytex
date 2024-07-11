package envs

import (
	"os"
)

func JWT_ACCESS_KEY() string {
	env := os.Getenv("JWT_ACCESS_KEY")
	return env
}

func JWT_REFRESH_KEY() string {
	env := os.Getenv("JWT_REFRESH_KEY")
	return env
}
