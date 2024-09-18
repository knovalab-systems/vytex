package database

import (
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"github.com/knovalab-systems/vytex/app/v1/formats"
	"github.com/knovalab-systems/vytex/app/v1/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedDB(db *gorm.DB) {
	roles := []*models.Role{}
	if db.Migrator().HasTable(&models.Role{}) {

		defaultRoles := models.DefaultRoles()
		for _, v := range defaultRoles {
			role := &models.Role{}
			err := db.Where(models.Role{Code: v.Code}).Assign(v).FirstOrCreate(role).Error
			if err != nil {
				log.Fatalln("error on create roles, %w", err)
			}
			roles = append(roles, role)
		}
	}

	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		generateUsers(db, roles)
	}

	var wg sync.WaitGroup

	stage1Functions := []struct {
		model interface{}
		fn    func(*gorm.DB)
	}{
		{&models.Color{}, generateColors},
		{&models.Supplier{}, generateSupplier},
		{&models.Composition{}, generateComposition},
	}

	for _, item := range stage1Functions {
		var count int64
		db.Model(item.model).Count(&count)
		if count == 0 {
			wg.Add(1)
			go func(f func(*gorm.DB)) {
				defer wg.Done()
				f(db)
			}(item.fn)
		}
	}
	wg.Wait()

	stage2Functions := []struct {
		model interface{}
		fn    func(*gorm.DB)
	}{
		{&models.Resource{}, generateResource},
		{&models.Fabric{}, generateFabric},
		{&models.Image{}, generateImage},
	}

	for _, item := range stage2Functions {
		var count int64
		db.Model(item.model).Count(&count)
		if count == 0 {
			wg.Add(1)
			go func(f func(*gorm.DB)) {
				defer wg.Done()
				f(db)
			}(item.fn)
		}
	}
	wg.Wait()

	var referenceCount int64
	db.Model(&models.Reference{}).Count(&referenceCount)
	if referenceCount == 0 {
		generateReference(db)
	}

	var customCount int64
	db.Model(&models.Custom{}).Count(&customCount)
	if customCount == 0 {
		generateCustoms(db)
	}
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

func generateUsers(db *gorm.DB, roles []*models.Role) {
	predefinedUsers := []struct {
		Username string
		Name     string
		Role     string
	}{
		{"super_admin", "Admin User", roles[0].ID},
		{"diseno", "Designer User", roles[1].ID},
		{"supervisor", "Supervisor", roles[2].ID},
	}

	var users []models.User

	for _, u := range predefinedUsers {
		user := models.User{
			ID:       uuid.New().String(),
			Username: u.Username,
			Name:     u.Name,
			RoleId:   u.Role,
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Password123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("No se pudo encriptar la contraseña: %v", err)
		}
		user.Password = string(hashedPassword)

		now := time.Now()
		user.CreatedAt = &now
		user.UpdatedAt = &now

		users = append(users, user)
	}

	for i := 0; i < 10; i++ {
		user := models.User{
			ID:       uuid.New().String(),
			Username: faker.Username(),
			Name:     faker.Name(),
			RoleId:   roles[i%len(roles)].ID,
		}

		password := "Password123"
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

	// add unique supplier
	supplier := models.Supplier{
		Name:  faker.Name(),
		Brand: faker.LastName(),
		Code:  "12345",
		Nit:   "123456789",
	}

	suppliers = append(suppliers, supplier)

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

		comp := []uint{algod, elast, lino, nylon, polye, rayon, rayvis, tencel, visco, hilom}
		total := 10000

		for j := 0; j < len(comp)-1; j++ {
			comp[j] = uint(rand.Intn(total + 1))
			total -= int(comp[j])
		}
		comp[len(comp)-1] = uint(total)

		composition := models.Composition{
			Algod:  comp[0],
			Elast:  comp[1],
			Lino:   comp[2],
			Nylon:  comp[3],
			Polye:  comp[4],
			Rayon:  comp[5],
			Rayvis: comp[6],
			Tencel: comp[7],
			Visco:  comp[8],
			Hilom:  comp[9],
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

		tbt := &models.TimeByTask{}
		err := db.FirstOrCreate(tbt, formats.TimeByTaskDTOFormat(models.TimeByTaskDTO{})).Error
		if err != nil {
			log.Fatalf("No se pudo crear la referencia: %v", err)
		}

		// Create a fake reference
		reference := &models.Reference{
			Code:         code,
			CreatedBy:    users[rand.Intn(len(users))].ID,
			Front:        images[rand.Intn(len(images))].ID,
			Back:         images[rand.Intn(len(images))].ID,
			Colors:       generateFakeColorsByReference(db),
			TimeByTaskID: tbt.ID,
		}

		// Insert the reference into the database
		err = db.Create(&reference).Error
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
			OrderStateID:       1,
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
