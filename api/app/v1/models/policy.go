package models

type Policy string

const (
	ReadUsers             Policy = "ReadUsers"
	CreateUsers           Policy = "CreateUsers"
	UpdateUsers           Policy = "UpdateUsers"
	ReadColors            Policy = "ReadColors"
	CreateColors          Policy = "CreateColors"
	UpdateColors          Policy = "UpdateColors"
	ReadCustoms           Policy = "ReadCustoms"
	CreateCustoms         Policy = "CreateCustoms"
	UpdateCustoms         Policy = "UpdateCustoms"
	ReadFabrics           Policy = "ReadFabrics"
	CreateFabrics         Policy = "CreateFabrics"
	UpdateFabrics         Policy = "UpdateFabrics"
	ReadOrders            Policy = "ReadOrders"
	CreateOrders          Policy = "CreateOrders"
	UpdateOrders          Policy = "UpdateOrders"
	ReadReferences        Policy = "ReadReferences"
	CreateReferences      Policy = "CreateReferences"
	UpdateReferences      Policy = "UpdateReferences"
	UpdateTimesReferences Policy = "UpdateTimesReferences"
	ReadResources         Policy = "ReadResources"
	CreateResources       Policy = "CreateResources"
	UpdateResources       Policy = "UpdateResources"
	ReadSuppliers         Policy = "ReadSuppliers"
	CreateSuppliers       Policy = "CreateSuppliers"
	UpdateSuppliers       Policy = "UpdateSuppliers"
	StartOrder            Policy = "StartOrder"
	ReadCorte             Policy = "ReadCorte"
)