package database

import (
	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"math/rand"
	"sync"
	"time"
)

func SeedDB(db *gorm.DB) {
	roles := []string{
		"31b63ffb-15f5-48d7-9a24-587f437f07ec", // Admin Role
		"739c8723-85c0-42d8-aef0-5de054890dee", // No Role
		"b3c766e9-3d70-4f33-a816-b0cd6168da81", // Designer Role
	}

	insertUsers(db, roles)

	var wg sync.WaitGroup
	functions := []func(*gorm.DB){insertColors, generateSupplier, generateComposition}

	for _, fn := range functions {
		wg.Add(1)
		go func(f func(*gorm.DB)) {
			defer wg.Done()
			f(db)
		}(fn)
	}

	wg.Wait()
	generateResource(db)
	generateFabric(db)
}

func reduceStringLength(input string, length int) string {
	if len(input) > length {
		return input[:length]
	}
	return input
}

func generateColorCode() string {
	const letters = "0123456789ABCDEF"
	code := "#"
	for i := 0; i < 6; i++ {
		code += string(letters[rand.Intn(len(letters))])
	}
	return code
}

func generateUniqueCode(existingCodes map[string]struct{}, length int) string {
	var code string
	for {
		code = reduceStringLength(faker.CCNumber(), length)
		if _, exists := existingCodes[code]; !exists {
			existingCodes[code] = struct{}{}
			break
		}
	}
	return code
}

func insertUsers(db *gorm.DB, roles []string) {
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

	result := db.Create(&users)
	if result.Error != nil {
		log.Fatalf("No se pudo crear los usuarios: %v", result.Error)
	}
}

func insertColors(db *gorm.DB) {
	var colors []models.Color
	uniqueCodes := make(map[string]struct{})

	for i := 0; i < 10; i++ {
		code := generateUniqueCode(uniqueCodes, 5)

		color := models.Color{
			Name: faker.Name(),
			Code: code,
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

func generateSupplier(db *gorm.DB) {
	var suppliers []models.Supplier
	uniqueCodes := make(map[string]struct{})
	uniqueNits := make(map[string]struct{})

	for i := 0; i < 10; i++ {
		code := generateUniqueCode(uniqueCodes, 4)
		nit := generateUniqueCode(uniqueNits, 9)

		supplier := models.Supplier{
			Name:  faker.Name(),
			Brand: faker.LastName(),
			Nit:   nit,
			Code:  code,
		}

		now := time.Now()
		supplier.CreatedAt = &now
		supplier.UpdatedAt = &now

		suppliers = append(suppliers, supplier)
	}

	result := db.Create(&suppliers)
	if result.Error != nil {
		log.Fatalf("No se pudo crear los proveedores: %v", result.Error)
	}
}

func generateResource(db *gorm.DB) {
	var resources []models.Resource

	var suppliers []models.Supplier
	result := db.Find(&suppliers)
	if result.Error != nil {
		log.Fatalf("No se pudo obtener los proveedores: %v", result.Error)
	}

	var colors []models.Color
	result = db.Find(&colors)
	if result.Error != nil {
		log.Fatalf("No se pudo obtener los colores: %v", result.Error)
	}

	uniqueCodes := make(map[string]struct{})

	for i := 0; i < 10; i++ {
		code := generateUniqueCode(uniqueCodes, 5)

		resource := models.Resource{
			Name:       faker.Name(),
			Cost:       float64(faker.UnixTime()),
			Code:       code,
			ColorID:    colors[rand.Intn(len(colors))].ID,
			SupplierID: suppliers[rand.Intn(len(suppliers))].ID,
		}

		now := time.Now()
		resource.CreatedAt = now

		resources = append(resources, resource)
	}

	result = db.Create(&resources)
}

func generateComposition(db *gorm.DB) {
	var compositions []models.Composition

	for i := 0; i < 10; i++ {
		var algod, elast, lino, nylon, polye, rayon, rayvis, tencel, visco, hilom uint
		total := 0

		for total < 100 {
			remaining := 100 - total
			algod = uint(rand.Intn(remaining + 1))
			total += int(algod)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			elast = uint(rand.Intn(remaining + 1))
			total += int(elast)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			lino = uint(rand.Intn(remaining + 1))
			total += int(lino)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			nylon = uint(rand.Intn(remaining + 1))
			total += int(nylon)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			polye = uint(rand.Intn(remaining + 1))
			total += int(polye)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			rayon = uint(rand.Intn(remaining + 1))
			total += int(rayon)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			rayvis = uint(rand.Intn(remaining + 1))
			total += int(rayvis)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			tencel = uint(rand.Intn(remaining + 1))
			total += int(tencel)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			visco = uint(rand.Intn(remaining + 1))
			total += int(visco)
			if total >= 100 {
				break
			}

			remaining = 100 - total
			hilom = uint(rand.Intn(remaining + 1))
			total += int(hilom)
			if total >= 100 {
				break
			}
		}

		composition := models.Composition{
			Algod:  algod,
			Elast:  elast,
			Lino:   lino,
			Nylon:  nylon,
			Polye:  polye,
			Rayon:  rayon,
			Rayvis: rayvis,
			Tencel: tencel,
			Visco:  visco,
			Hilom:  hilom,
		}

		compositions = append(compositions, composition)
	}

	result := db.Create(&compositions)
	if result.Error != nil {
		log.Fatalf("No se pudo crear las composiciones: %v", result.Error)
	}
}

func generateFabric(db *gorm.DB) {
	var fabrics []models.Fabric

	var suppliers []models.Supplier
	result := db.Find(&suppliers)
	if result.Error != nil {
		log.Fatalf("No se pudo obtener los proveedores: %v", result.Error)
	}

	var colors []models.Color
	result = db.Find(&colors)
	if result.Error != nil {
		log.Fatalf("No se pudo obtener los colores: %v", result.Error)
	}

	var compositions []models.Composition
	result = db.Find(&compositions)
	if result.Error != nil {
		log.Fatalf("No se pudo obtener las composiciones: %v", result.Error)
	}

	for i := 0; i < 10; i++ {
		fabric := models.Fabric{
			Name:          faker.Name(),
			Cost:          float64(faker.UnixTime()),
			Code:          faker.YearString(),
			ColorID:       colors[rand.Intn(len(colors))].ID,
			SupplierID:    suppliers[rand.Intn(len(suppliers))].ID,
			CompositionID: compositions[rand.Intn(len(compositions))].ID,
		}

		now := time.Now()
		fabric.CreatedAt = &now

		fabrics = append(fabrics, fabric)
	}

	result = db.Create(&fabrics)
}
