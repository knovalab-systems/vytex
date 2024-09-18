package database

import (
	"log"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"github.com/knovalab-systems/vytex/platform/migrations"
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

func DB() *gorm.DB {
	var err error
	var db *gorm.DB

	if envs.ENVIRONMENT() == "test" {
		db, err = gorm.Open(postgres.Open(envs.DSNTEST()), &gorm.Config{SkipDefaultTransaction: true})
	} else {
		db, err = gorm.Open(postgres.Open(envs.DSN()), &gorm.Config{})
	}

	if err != nil {
		log.Fatalln("error, not connected to database, %w", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Session{},
		&models.Color{}, &models.Resource{}, &models.Fabric{},
		&models.Reference{}, &models.ColorByReference{},
		&models.ResourceByReference{}, &models.FabricByReference{},
		&models.Image{}, &models.Supplier{}, &models.Composition{},
		&models.Custom{}, &models.Order{}, &models.TimeByTask{}, &models.Role{},
		&models.OrderState{}, &models.Step{}, &models.Task{}, &models.TaskControl{})
	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	err = migrations.Migrate(db)
	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	return db
}

func DBGEN() *gorm.DB {

	db, err := gorm.Open(postgres.Open(envs.DSNGEN()), &gorm.Config{})
	if err != nil {
		log.Fatalln("error, not connected to database, %w", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Session{},
		&models.Color{}, &models.Resource{}, &models.Fabric{},
		&models.Reference{}, &models.ColorByReference{},
		&models.ResourceByReference{}, &models.FabricByReference{},
		&models.Image{}, &models.Supplier{}, &models.Composition{},
		&models.Custom{}, &models.Order{}, &models.TimeByTask{}, &models.Role{},
		&models.OrderState{}, &models.Step{}, &models.Task{}, &models.TaskControl{})

	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	err = migrations.Migrate(db)
	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	return db
}
