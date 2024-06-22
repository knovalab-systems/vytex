package database

import (
	"fmt"
	"log"
	"os"

	"github.com/knovalab-systems/vytex/app/v1/models"
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

func Db(host string) *gorm.DB {
	dbHost := host

	if host == "" {
		dbHost = os.Getenv("DB_HOST")
	}

	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbName := os.Getenv("DB_NAME")
	dbPassWord := os.Getenv("DB_PASSWORD")
	dbUrl := makeUrl(dbHost, dbPort, dbUser, dbName, dbPassWord)

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		log.Fatalln("error, not connected to database, %w", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Session{},
		&models.Color{}, &models.Resource{}, &models.Fabric{},
		&models.Reference{}, &models.ColorByReference{},
		&models.ResourceByReference{}, &models.FabricByReference{})
	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	return db
}

func makeUrl(host string, port string, user string, name string, password string) string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s", host, port, user, name, password)
}
