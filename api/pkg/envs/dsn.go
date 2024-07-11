package envs

import (
	"fmt"
	"os"
)

func DSN() string {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	name := os.Getenv("DB_NAME")
	password := os.Getenv("DB_PASSWORD")

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, name, password)
}
