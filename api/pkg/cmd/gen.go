package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/knovalab-systems/vytex/platform/database"
	"gorm.io/gen"
)

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath:      "../query/",
		OutFile:      "query.go",
		WithUnitTest: true,
		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface, // generate mode
	})

	err := godotenv.Load("../../.env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	gormdb := database.DBGEN()

	// use gorm db
	g.UseDB(gormdb)

	// Generate basic type-safe DAO API for struct `model.name`
	g.ApplyBasic(models.User{}, models.Session{},
		models.Color{}, models.Resource{}, models.Fabric{},
		models.Reference{}, models.ColorByReference{}, models.Piece{},
		models.ResourceByReference{}, models.FabricByReference{},
		models.Image{}, models.Supplier{}, models.Composition{},
		models.Custom{}, models.Order{}, models.TimeByTask{}, models.Role{},
		models.OrderState{}, models.Step{}, models.Task{}, models.TaskControl{},
		models.TaskControlState{}, models.Operation{})

	// Generate the code
	g.Execute()
}
