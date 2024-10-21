package helpers

import (
	"errors"

	"github.com/knovalab-systems/vytex/pkg/problems"
	"github.com/knovalab-systems/vytex/pkg/query"
	"gorm.io/gorm"
)

func CheckSupplierExists(code string, nit string) error {
	table := query.Supplier

	supplier, err := table.Unscoped().Where(table.Code.Eq(code)).Or(table.Nit.Eq(nit)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return problems.ServerError()
	}
	if supplier.Code == code && supplier.Nit == nit {
		return problems.SupplierCodeNitExists()
	}
	if supplier.Code == code {
		return problems.SupplierCodeExists()
	}
	return problems.SupplierNitExists()
}
