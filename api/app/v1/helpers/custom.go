package helpers

import (
	"errors"

	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

func CheckValidCustom(customID uint) error {
	table := query.Custom

	// def query
	custom, err := table.Unscoped().Where(table.ID.Eq(customID)).First()

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}

	if custom.FinishedAt != nil {
		return problems.CustomFinished()
	} else if custom.CanceledAt != nil {
		return problems.CustomCanceled()
	}

	return nil
}
