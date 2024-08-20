package formats

import (
	"github.com/knovalab-systems/vytex/app/v1/models"
	"gorm.io/gorm"
)

type checkResourceExistsType func(string) error

func ResourceUpdateVersion(b *models.ResourceUpdateBody, r *models.Resource, cr checkResourceExistsType) (bool, error) {
	hasChanges := false

	if b.Name != "" && b.Name != r.Name {
		r.Name = b.Name
		hasChanges = true
	}

	if b.Code != "" && b.Code != r.Code {
		err := cr(b.Code)
		if err != nil {
			return hasChanges, err
		}
		r.Code = b.Code
		hasChanges = true
	}

	if b.Cost != 0 && b.Cost != r.Cost {
		r.Cost = b.Cost
		hasChanges = true
	}

	if b.Color != 0 && b.Color != r.ColorID {
		r.ColorID = b.Color
		hasChanges = true
	}

	if b.Supplier != 0 && b.Supplier != r.SupplierID {
		r.SupplierID = b.Supplier
		hasChanges = true
	}

	if !b.DeletedAt.IsNil() {
		var deleted_at = gorm.DeletedAt{}
		if b.DeletedAt.IsNullDefined() && r.DeletedAt.Valid {
			r.DeletedAt = deleted_at
			hasChanges = true
		} else if !b.DeletedAt.IsNullDefined() && !r.DeletedAt.Valid {
			deleted_at.Time = *b.DeletedAt.Value
			deleted_at.Valid = true
			r.DeletedAt = deleted_at
			hasChanges = true
		}
	}

	return hasChanges, nil
}
