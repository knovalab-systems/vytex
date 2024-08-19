package database

import (
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {
	roles := []string{
		"31b63ffb-15f5-48d7-9a24-587f437f07ec", // Admin Role
		"739c8723-85c0-42d8-aef0-5de054890dee", // No Role
		"b3c766e9-3d70-4f33-a816-b0cd6168da81", // Designer Role
	}

	generateUsers(db, roles)

	var wg sync.WaitGroup

	stage1Functions := []func(*gorm.DB){generateColors, generateSupplier, generateComposition}
	for _, fn := range stage1Functions {
		wg.Add(1)
		go func(f func(*gorm.DB)) {
			defer wg.Done()
			f(db)
		}(fn)
	}
	wg.Wait()

	stage2Functions := []func(*gorm.DB){generateResource, generateFabric, generateImage}
	for _, fn := range stage2Functions {
		wg.Add(1)
		go func(f func(*gorm.DB)) {
			defer wg.Done()
			f(db)
		}(fn)
	}
	wg.Wait()

	generateReference(db)

	generateCustoms(db)
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

func generateUsers(db *gorm.DB, roles []string) {
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

func generateColors(db *gorm.DB) {
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
		resource.CreatedAt = &now

		resources = append(resources, resource)
	}

	db.Create(&resources)
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

	uniqueCodes := make(map[string]struct{})

	for i := 0; i < 10; i++ {
		code := generateUniqueCode(uniqueCodes, 5)

		fabric := models.Fabric{
			Name:          faker.Name(),
			Cost:          float64(faker.UnixTime()),
			Code:          code,
			ColorID:       colors[rand.Intn(len(colors))].ID,
			SupplierID:    suppliers[rand.Intn(len(suppliers))].ID,
			CompositionID: compositions[rand.Intn(len(compositions))].ID,
		}

		now := time.Now()
		fabric.CreatedAt = &now

		fabrics = append(fabrics, fabric)
	}

	db.Create(&fabrics)
}

func generateImage(db *gorm.DB) {
	var images []models.Image

	for i := 0; i < 10; i++ {
		image := models.Image{
			ID:       uuid.New().String(),
			Location: faker.Name(),
		}

		images = append(images, image)
	}

	result := db.Create(&images)
	if result.Error != nil {
		log.Fatalf("No se pudo crear las imágenes: %v", result.Error)
	}
}

func generateFakeColorsByReference(db *gorm.DB) []models.ColorByReference {
	var colors []models.Color
	if err := db.Find(&colors).Error; err != nil {
		log.Fatalf("No se pudo obtener los colores: %v", err)
	}

	var colorsByReference []models.ColorByReference
	for i := 0; i < 3; i++ {
		colorsByReference = append(colorsByReference, models.ColorByReference{
			ColorID:   colors[rand.Intn(len(colors))].ID,
			Fabrics:   generateFakeFabricsByReference(db),
			Resources: generateFakeResourcesByReference(db),
		})
	}
	return colorsByReference
}

func generateFakeResourcesByReference(db *gorm.DB) []models.ResourceByReference {
	var resources []models.Resource
	if err := db.Find(&resources).Error; err != nil {
		log.Fatalf("No se pudo obtener los recursos: %v", err)
	}

	var resourcesByReference []models.ResourceByReference
	for i := 0; i < 2; i++ {
		resourcesByReference = append(resourcesByReference, models.ResourceByReference{
			ResourceId: resources[rand.Intn(len(resources))].ID,
			Size:       generateFakeSize(),
		})
	}
	return resourcesByReference
}

func generateFakeFabricsByReference(db *gorm.DB) []models.FabricByReference {
	var fabrics []models.Fabric
	if err := db.Find(&fabrics).Error; err != nil {
		log.Fatalf("No se pudo obtener las telas: %v", err)
	}

	var fabricsByReference []models.FabricByReference
	for i := 0; i < 2; i++ {
		fabricsByReference = append(fabricsByReference, models.FabricByReference{
			FabricId: fabrics[rand.Intn(len(fabrics))].ID,
			Size:     generateFakeSize(),
		})
	}
	return fabricsByReference
}

func generateFakeSize() models.Size {
	return models.Size{
		XS2: float64(rand.Intn(999)),
		XS:  float64(rand.Intn(999)),
		S:   float64(rand.Intn(999)),
		M:   float64(rand.Intn(999)),
		L:   float64(rand.Intn(999)),
		XL:  float64(rand.Intn(999)),
		XL2: float64(rand.Intn(999)),
		XL3: float64(rand.Intn(999)),
		XL4: float64(rand.Intn(999)),
		XL5: float64(rand.Intn(999)),
		XL6: float64(rand.Intn(999)),
		XL7: float64(rand.Intn(999)),
		XL8: float64(rand.Intn(999)),
	}
}

func generateReference(db *gorm.DB) {
	uniqueCodes := make(map[string]struct{})

	// Get all user IDs
	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		log.Fatalf("No se pudo obtener los usuarios: %v", err)
	}

	var images []models.Image
	if err := db.Find(&images).Error; err != nil {
		log.Fatalf("No se pudo obtener las imágenes: %v", err)
	}

	for i := 0; i < 3; i++ {
		code := generateUniqueCode(uniqueCodes, 5)

		// Create a fake reference
		reference := &models.Reference{
			Code:      code,
			CreatedBy: users[rand.Intn(len(users))].ID,
			Front:     images[rand.Intn(len(images))].ID,
			Back:      images[rand.Intn(len(images))].ID,
			Colors:    generateFakeColorsByReference(db),
		}

		// Insert the reference into the database
		err := db.Create(&reference).Error
		if err != nil {
			log.Fatalf("No se pudo crear la referencia: %v", err)
		}
	}
}

func generateCustoms(db *gorm.DB) {
	var customs []models.Custom
	var users []models.User
	var colorByReferences []models.ColorByReference

	// Fetch all users and color references
	if err := db.Find(&users).Error; err != nil {
		log.Fatalf("No se pudo obtener los usuarios: %v", err)
	}
	if err := db.Find(&colorByReferences).Error; err != nil {
		log.Fatalf("No se pudo obtener las referencias de color: %v", err)
	}

	for i := 0; i < 3; i++ {
		createdBy := users[rand.Intn(len(users))].ID

		custom := models.Custom{
			Client:    faker.Name(),
			CreatedBy: createdBy,
			Orders:    generateOrders(createdBy, colorByReferences),
		}

		now := time.Now()
		custom.CreatedAt = &now

		customs = append(customs, custom)
	}

	if err := db.Create(&customs).Error; err != nil {
		log.Fatalf("No se pudo crear los customs: %v", err)
	}
}

func generateOrders(createdBy string, colorByReferences []models.ColorByReference) []models.Order {
	var orders []models.Order

	for i := 0; i < 3; i++ {
		order := models.Order{
			Status:             models.Created,
			CreatedBy:          createdBy,
			ColorByReferenceID: colorByReferences[rand.Intn(len(colorByReferences))].ID,
			SizeInt:            generateSizeInt(),
		}

		now := time.Now()
		order.CreatedAt = &now

		orders = append(orders, order)
	}

	return orders
}

func generateSizeInt() models.SizeInt {
	return models.SizeInt{
		XS2: rand.Intn(999),
		XS:  rand.Intn(999),
		S:   rand.Intn(999),
		M:   rand.Intn(999),
		L:   rand.Intn(999),
		XL:  rand.Intn(999),
		XL2: rand.Intn(999),
		XL3: rand.Intn(999),
		XL4: rand.Intn(999),
		XL5: rand.Intn(999),
		XL6: rand.Intn(999),
		XL7: rand.Intn(999),
		XL8: rand.Intn(999),
	}
}
