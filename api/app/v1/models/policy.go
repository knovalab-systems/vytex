package models

type Policy int64

const (
	ReadUsers Policy = iota
	CreateUsers
	UpdateUsers
	ReadColors
	CreateColors
	UpdateColors
	ReadCustoms
	CreateCustoms
	UpdateCustoms
	ReadFabrics
	CreateFabrics
	UpdateFabrics
	ReadOrders
	CreateOrders
	UpdateOrders
	ReadReferences
	CreateReferences
	UpdateReferences
	UpdateTimesReferences
	ReadResources
	CreateResources
	UpdateResources
	ReadSuppliers
	CreateSuppliers
	UpdateSuppliers
	StartOrder
	ReadCorte
)
