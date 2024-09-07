package models

type Policie int64

const (
	ReadUsers Policie = iota
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
)
