package envs

import (
	"os"
)

func NO_ROLE() string {
	env, exists := os.LookupEnv("NO_ROLE")
	if !exists {
		return "739c8723-85c0-42d8-aef0-5de054890dee" // for test purporse
	}
	return env
}
