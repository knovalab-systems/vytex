package formats

import (
	"errors"
	"testing"
	"time"

	"github.com/knovalab-systems/vytex/app/v1/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestToUpdateResource(t *testing.T) {

	resource := models.Resource{
		Name:       "name",
		ColorID:    1,
		SupplierID: 1,
		Code:       "1",
		Cost:       10000,
		DeletedAt: gorm.DeletedAt{
			Time:  time.Now(),
			Valid: true,
		},
	}

	mockError := errors.New("ERROR")
	mockResourceExists := func(s string) error { return nil }
	mockResourceExistsError := func(s string) error { return mockError }

	t.Run("not change", func(t *testing.T) {

		resourceUpdateBody := &models.ResourceUpdateBody{
			Color:     1,
			Supplier:  1,
			Code:      "1",
			Cost:      10000,
			DeletedAt: models.Optional[time.Time]{}}
		hasChanges, err := ResourceUpdateVersion(resourceUpdateBody, &resource, mockResourceExists)

		if assert.NoError(t, err) {
			assert.Equal(t, hasChanges, false)
		}
	})

	t.Run("return error", func(t *testing.T) {

		resourceUpdateBody := &models.ResourceUpdateBody{
			Color:     1,
			Supplier:  1,
			Code:      "2",
			Cost:      10000,
			DeletedAt: models.Optional[time.Time]{}}
		_, err := ResourceUpdateVersion(resourceUpdateBody, &resource, mockResourceExistsError)

		if assert.Error(t, err) {
			assert.Equal(t, err, mockError)
		}
	})

	newTime := time.Now().Add(time.Hour)

	changesTestCases := []models.ResourceUpdateBody{{
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
	}}

	for i := range changesTestCases {
		testCase := changesTestCases[i]

		t.Run("change", func(t *testing.T) {
			hasChanges, err := ResourceUpdateVersion(&testCase, &resource, mockResourceExists)

			if assert.NoError(t, err) {
				assert.Equal(t, hasChanges, true)
			}
		})

	}
}
