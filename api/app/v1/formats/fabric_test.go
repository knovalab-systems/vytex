package formats

import (
	"errors"
	"testing"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestToUpdateFabric(t *testing.T) {
	fabric := models.Fabric{
		Name:          "name",
		ColorID:       1,
		SupplierID:    1,
		Code:          "1",
		Cost:          10000,
		CompositionID: 1,
		DeletedAt: &gorm.DeletedAt{
			Time:  time.Now(),
			Valid: true,
		},
	}

	mockError := errors.New("ERROR")
	mockGetComposition := func(c *models.Composition) (*models.Composition, error) { return &models.Composition{}, nil }
	mockGetCompositionError := func(c *models.Composition) (*models.Composition, error) { return &models.Composition{}, mockError }
	mockFabricExists := func(s string) error { return nil }
	mockFabricExistsError := func(s string) error { return mockError }

	t.Run("not change", func(t *testing.T) {

		fabricUpdateBody := &models.FabricUpdateBody{
			Color:     1,
			Supplier:  1,
			Code:      "1",
			Cost:      10000,
			DeletedAt: models.Optional[time.Time]{}}
		hasChanges, err := FabricUpdateVersion(fabricUpdateBody, &fabric, mockGetComposition, mockFabricExists)

		if assert.NoError(t, err) {
			assert.Equal(t, hasChanges, false)
		}
	})

	t.Run("return error with fabric exists", func(t *testing.T) {

		fabricUpdateBody := &models.FabricUpdateBody{
			Color:     1,
			Supplier:  1,
			Code:      "2",
			Cost:      10000,
			DeletedAt: models.Optional[time.Time]{}}
		_, err := FabricUpdateVersion(fabricUpdateBody, &fabric, mockGetComposition, mockFabricExistsError)

		if assert.Error(t, err) {
			assert.Equal(t, err, mockError)
		}
	})

	t.Run("return error with get composition", func(t *testing.T) {

		fabricUpdateBody := &models.FabricUpdateBody{
			Color:       1,
			Supplier:    1,
			Code:        "1",
			Cost:        10000,
			Composition: &models.Composition{Algod: 10000},
			DeletedAt:   models.Optional[time.Time]{}}
		_, err := FabricUpdateVersion(fabricUpdateBody, &fabric, mockGetCompositionError, mockFabricExists)

		if assert.Error(t, err) {
			assert.Equal(t, err, mockError)
		}
	})

	newTime := time.Now().Add(time.Hour)

	changesTestCases := []models.FabricUpdateBody{{
		Name: "newName",
	}, {
		Code: "2",
	}, {
		Cost: 20000,
	}, {
		Color: 2,
	}, {
		Supplier: 2,
	}, {
		DeletedAt: models.Optional[time.Time]{Defined: true},
	}, {
		DeletedAt: models.Optional[time.Time]{Defined: true, Value: &newTime},
	}, {Composition: &models.Composition{Algod: 10000}}}

	for i := range changesTestCases {
		testCase := changesTestCases[i]

		t.Run("change", func(t *testing.T) {
			hasChanges, err := FabricUpdateVersion(&testCase, &fabric, mockGetComposition, mockFabricExists)

			if assert.NoError(t, err) {
				assert.Equal(t, hasChanges, true)
			}
		})

	}
}
