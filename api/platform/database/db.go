package database

import (
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/pkg/envs"
	"golang.org/x/crypto/bcrypt"
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
		&models.Custom{}, &models.Order{}, &models.TimeByTask{}, &models.Role{})
	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	// base timebytask record
	if db.Migrator().HasTable(&models.TimeByTask{}) {
		err := db.FirstOrCreate(&models.TimeByTask{}, formats.TimeByTaskDTOFormat(models.TimeByTaskDTO{})).Error
		if err != nil {
			log.Fatalln("error on create timebytask record, not migrated, %w", err)
		}
	}

	// basic roles
	if db.Migrator().HasTable(&models.Role{}) {
		admin := &models.Role{}
		err := db.Where(models.Role{Name: models.ADMIN_ROLE_NAME, ID: envs.ADMIN_ROLE()}).Assign(models.ADMIN_ROLE()).FirstOrCreate(admin).Error
		if err != nil {
			log.Fatalln("error on create admin role, not migrated, %w", err)
		}
		err = db.Where(models.Role{Name: models.DESIGNER_ROLE_NAME, ID: envs.DESIGNER_ROLE()}).Assign(models.DESIGNER_ROLE()).FirstOrCreate(&models.Role{}).Error
		if err != nil {
			log.Fatalln("error on create designer role, not migrated, %w", err)
		}
		err = db.Where(models.Role{Name: models.PRO_SUPERVISOR_ROLE_NAME, ID: envs.PRO_SUPERVISOR_ROLE()}).Assign(models.PRO_SUPERVISOR_ROLE()).FirstOrCreate(&models.Role{}).Error
		if err != nil {
			log.Fatalln("error on create pro supervisor role, not migrated, %w", err)
		}

		if db.Migrator().HasTable(&models.User{}) {
			if err := db.First(&models.User{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
				hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Password123"), bcrypt.DefaultCost) // pending: from env password
				if err != nil {
					log.Fatalf("No se pudo encriptar la contraseña: %v", err)
				}
				now := time.Now()
				result := db.Create(&models.User{
					ID:        uuid.New().String(),
					Username:  "admin",
					Name:      "Administrador",
					Password:  string(hashedPassword),
					CreatedAt: &now,
					UpdatedAt: &now,
					RoleId:    admin.ID,
				})
				if result.Error != nil {
					log.Fatalf("Error al crear administrador: %v", err)
				}
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
		&models.Custom{}, &models.Order{}, &models.TimeByTask{}, &models.Role{})

	if err != nil {
		log.Fatalln("error, not migrated, %w", err)
	}

	return db
}
