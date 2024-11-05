package envs

import (
	"os"
	"strings"
)

func Origins() []string {
	origins := []string{"http://localhost:4040"}
	env, exists := os.LookupEnv("ORIGINS")
	if exists {
		if env != "" {
			arr := strings.Split(env, ",")
			origins = arr
		}
	}
	return origins
}
