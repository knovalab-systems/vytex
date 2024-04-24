package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     string
	Password string
	User     string
	DBName   string
	SSLMode  string
}

func Db() *gorm.DB {
	var dbUrl string

	env := os.Getenv("ENV")

	if env == "test" {
		dbHost := os.Getenv("TEST_HOST")
		dbPort := os.Getenv("TEST_PORT")
		dbUser := os.Getenv("TEST_USER")
		dbName := os.Getenv("TEST_NAME")
		dbPassWord := os.Getenv("TEST_PASSWORD")
		dbUrl = makeUrl(dbHost, dbPort, dbUser, dbName, dbPassWord)
	} else {
		dbHost := os.Getenv("DB_HOST")
		dbPort := os.Getenv("DB_PORT")
		dbUser := os.Getenv("DB_USER")
		dbName := os.Getenv("DB_NAME")
		dbPassWord := os.Getenv("DB_PASSWORD")
		dbUrl = makeUrl(dbHost, dbPort, dbUser, dbName, dbPassWord)
	}

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		log.Fatalln("error, not connected to database, %w", err)
	}

	db.AutoMigrate()

	return db
}

func makeUrl(host string, port string, user string, name string, password string) string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, name, password)
}
