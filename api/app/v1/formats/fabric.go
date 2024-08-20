package formats

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

type getCompositionType func(*models.Composition) (*models.Composition, error)
type checkFabricExistsType func(string) error

func FabricUpdateVersion(b *models.FabricUpdateBody, f *models.Fabric, gc getCompositionType, cf checkFabricExistsType) (bool, error) {
	hasChanges := false

	if b.Composition != nil {
		c, err := gc(b.Composition)
		if err != nil {
			return hasChanges, err
		}
		if f.CompositionID != c.ID {
			f.CompositionID = c.ID
			hasChanges = true
		}
	}

	if b.Name != "" && b.Name != f.Name {
		f.Name = b.Name
		hasChanges = true
	}

	if b.Code != "" && b.Code != f.Code {
		err := cf(b.Code)
		if err != nil {
			return hasChanges, err
		}
		f.Code = b.Code
		hasChanges = true
	}

	if b.Cost != 0 && b.Cost != f.Cost {
		f.Cost = b.Cost
		hasChanges = true
	}

	if b.Color != 0 && b.Color != f.ColorID {
		f.ColorID = b.Color
		hasChanges = true
	}

	if b.Supplier != 0 && b.Supplier != f.SupplierID {
		f.SupplierID = b.Supplier
		hasChanges = true
	}

	if !b.DeletedAt.IsNil() {
		var deleted_at = gorm.DeletedAt{}
		if b.DeletedAt.IsNullDefined() && f.DeletedAt.Valid {
			f.DeletedAt = deleted_at
			hasChanges = true
		} else if !b.DeletedAt.IsNullDefined() && !f.DeletedAt.Valid {
			deleted_at.Time = *b.DeletedAt.Value
			deleted_at.Valid = true
			f.DeletedAt = deleted_at
			hasChanges = true
		}
	}

	return hasChanges, nil
}
