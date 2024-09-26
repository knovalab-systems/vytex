package models

type Policy string

func (m *Policy) Valid() bool {
	switch *m { // purpose of being legible
	case ReadUsers, ReadColors, ReadCustoms, ReadFabrics, ReadOrders, ReadReferences, ReadResources, ReadSuppliers, ReadCorte, ReadRoles:
		return true
	case CreateUsers, CreateColors, CreateCustoms, CreateFabrics, CreateOrders, CreateReferences, CreateResources, CreateSuppliers, CreateRoles:
		return true
	case UpdateUsers, UpdateColors, UpdateCustoms, UpdateFabrics, UpdateOrders, UpdateReferences, UpdateTimesReferences, UpdateResources, UpdateSuppliers, UpdateCorte:
		return true
	}

	return false
}

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
	UpdateCorte           Policy = "UpdateCorte"
	ReadRoles             Policy = "ReadRoles"
	CreateRoles           Policy = "CreateRoles"
)
