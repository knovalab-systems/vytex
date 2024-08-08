package database

import (
	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"math/rand"
	"time"
)

func SeedDB(db *gorm.DB) {
	roles := []string{
		"31b63ffb-15f5-48d7-9a24-587f437f07ec", // Admin Role
		"739c8723-85c0-42d8-aef0-5de054890dee", // No Role
		"b3c766e9-3d70-4f33-a816-b0cd6168da81", // Designer Role
	}

	insertUsers(db, roles)
	insertColors(db)
	generateSupplier(db)
}

func insertUsers(db *gorm.DB, roles []string) {
	// insert predefined users
	predefinedUsers := []struct {
		Username string
		Name     string
		Role     string
	}{
		{"admin", "Admin User", roles[0]},
		{"norol", "No Role User", roles[1]},
		{"diseno", "Designer User", roles[2]},
	}

	var users []models.User

	for _, u := range predefinedUsers {
		user := models.User{
			ID:       uuid.New().String(),
			Username: u.Username,
			Name:     u.Name,
			Role:     u.Role,
		}

		password := "password123"
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		if err != nil {
			log.Fatalf("No se pudo encriptar la contraseña: %v", err)
		}
		user.Password = string(hashedPassword)

		now := time.Now()
		user.CreatedAt = &now
		user.UpdatedAt = &now

		users = append(users, user)
	}

	// insert standard users
	for i := 0; i < 2; i++ {
		user := models.User{
			ID:       uuid.New().String(),
			Username: faker.Username(),
			Name:     faker.Name(),
			Role:     roles[i%len(roles)],
		}

		password := "password"
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		if err != nil {
			log.Fatalf("No se pudo encriptar la contraseña: %v", err)
		}
		user.Password = string(hashedPassword)

		now := time.Now()
		user.CreatedAt = &now
		user.UpdatedAt = &now

		users = append(users, user)
	}

	// batch insert users
	result := db.Create(&users)
	if result.Error != nil {
		log.Fatalf("No se pudo crear los usuarios: %v", result.Error)
	}
}

func insertColors(db *gorm.DB) {
	var colors []models.Color

	for i := 0; i < 10; i++ {
		color := models.Color{
			Name: faker.Name(),
			Code: generateColorNumber(),
			Hex:  generateColorCode(),
		}

		now := time.Now()
		color.CreatedAt = &now
		color.UpdatedAt = &now

		colors = append(colors, color)
	}

	result := db.Create(&colors)
	if result.Error != nil {
		log.Fatalf("No se pudo crear los colores: %v", result.Error)
	}
}

func generateColorCode() string {
	const letters = "0123456789ABCDEF"
	code := "#"
	for i := 0; i < 6; i++ {
		code += string(letters[rand.Intn(len(letters))])
	}
	return code
}

func generateColorNumber() string {
	const digits = "0123456789"
	length := rand.Intn(3) + 4 // generates a number between 4 and 6
	code := ""
	for i := 0; i < length; i++ {
		code += string(digits[rand.Intn(len(digits))])
	}
	return code
}

func generateSupplier(db *gorm.DB) {
	s := models.Supplier{}
	err := faker.FakeData(&s)

	if err != nil {
		log.Fatalf("No se pudo generar el proveedor: %v", err)
	}

	result := db.Create(&s)
	if result.Error != nil {
		log.Fatalf("No se pudo crear el proveedor: %v", result.Error)
	}
}
