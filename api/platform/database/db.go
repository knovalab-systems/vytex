package database

import (
	"errors"
	"log"
	"os"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
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

	if os.Getenv("ENV") == "lab" {
		db, err = gorm.Open(postgres.Open(envs.DSNTEST()), &gorm.Config{SkipDefaultTransaction: true})
	} else {
		db, err = gorm.Open(postgres.Open(envs.DSN()), &gorm.Config{})
	}

	if err != nil {
		log.Fatalln("error, not connected to database, %w", err)
	}

	db.Exec(`
	DO $$ BEGIN
		CREATE TYPE status_order AS ENUM ('Created');
	EXCEPTION
		WHEN duplicate_object THEN null;
	END $$;`)

	err = db.AutoMigrate(&models.User{}, &models.Session{},
		&models.Color{}, &models.Resource{}, &models.Fabric{},
		&models.Reference{}, &models.ColorByReference{},
		&models.ResourceByReference{}, &models.FabricByReference{},
		&models.Image{}, &models.Supplier{}, &models.Composition{},
		&models.Custom{}, &models.Order{}, &models.TimeByTask{})

	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	if db.Migrator().HasTable(&models.TimeByTask{}) {
		if err := db.First(&models.TimeByTask{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
			time := map[string]interface{}{
				"trazar":    0,
				"plantear":  0,
				"tender":    0,
				"cortar":    0,
				"paquetear": 0,
				"filetear":  0,
				"armar":     0,
				"tapar":     0,
				"figurar":   0,
				"marquilla": 0,
				"cerrar":    0,
				"gafetes":   0,
				"presillar": 0,
				"pulir":     0,
				"revisar":   0,
				"acabados":  0,
				"bolsas":    0,
				"tiquetear": 0,
				"empacar":   0,
				"organizar": 0,
				"grabar":    0,
				"paletizar": 0,
			}
			err := db.Model(&models.TimeByTask{}).Create(time).Error
			if err != nil {
				log.Fatalln("error, not migrated, %w", err)
			}
		}
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
		&models.Custom{}, &models.Order{}, &models.TimeByTask{})

	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	return db
}
