package repository

import "github.com/knovalab-systems/vytex/app/v1/models"

type SupplierRepository interface {
	SelectSuppliers(*models.Query) ([]*models.Supplier, error)
	SelectSupplier(*models.ReadSupplier) (*models.Supplier, error)
	AggregationSuppliers(*models.AggregateQuery) ([]*models.AggregateData, error)
	CreateSupplier(*models.SupplierCreateBody) (*models.Supplier, error)
	UpdateSupplier(body *models.SupplierUpdateBody) (*models.Supplier, error)
}
