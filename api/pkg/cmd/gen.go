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

	gormdb := database.Db("localhost")

	// use gorm db
	g.UseDB(gormdb)

	// Generate basic type-safe DAO API for struct `model.User` following conventions
	g.ApplyBasic(models.User{}, models.Session{}, models.Color{}, models.Resource{}, models.ResourceV{})

	// Generate the code
	g.Execute()
}
