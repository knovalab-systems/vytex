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

func DSNTEST() string {
	host := os.Getenv("DB_HOST_TEST")
	port := os.Getenv("DB_PORT_TEST")
	user := os.Getenv("DB_USER_TEST")
	dbname := os.Getenv("DB_NAME_TEST")
	password := os.Getenv("DB_PASSWORD_TEST")

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, dbname, password)
}

func DSNGEN() string {
	host := os.Getenv("GEN_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	name := os.Getenv("DB_NAME")
	password := os.Getenv("DB_PASSWORD")

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, name, password)
}
