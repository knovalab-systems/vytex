import type { Policy } from '~/types/core';

export const POLICIES: Record<Policy, { name: string; value: Policy }> = {
	ReadUsers: {
		name: 'Ver usuarios',
		value: 'ReadUsers',
	},
	CreateUsers: {
		name: 'Crear usuarios',
		value: 'CreateUsers',
	},
	UpdateUsers: {
		name: 'Editar usuarios',
		value: 'UpdateUsers',
	},
	ReadColors: {
		name: 'Ver colores',
		value: 'ReadColors',
	},
	CreateColors: {
		name: 'Crear colores',
		value: 'CreateColors',
	},
	UpdateColors: {
		name: 'Editar colores',
		value: 'UpdateColors',
	},
	ReadCustoms: {
		name: 'Ver pedidos',
		value: 'ReadCustoms',
	},
	CreateCustoms: {
		name: 'Crear pedidos',
		value: 'CreateCustoms',
	},
	UpdateCustoms: {
		name: 'Editar pedidos',
		value: 'UpdateCustoms',
	},
	ReadFabrics: {
		name: 'Ver telas',
		value: 'ReadFabrics',
	},
	CreateFabrics: {
		name: 'Crear telas',
		value: 'CreateFabrics',
	},
	UpdateFabrics: {
		name: 'Editar telas',
		value: 'UpdateFabrics',
	},
	ReadOrders: {
		name: 'Ver ordenes',
		value: 'ReadOrders',
	},
	CreateOrders: {
		name: 'Crear ordenes',
		value: 'CreateOrders',
	},
	UpdateOrders: {
		name: 'Editar ordenes',
		value: 'UpdateOrders',
	},
	ReadReferences: {
		name: 'Ver referencias',
		value: 'ReadReferences',
	},
	CreateReferences: {
		name: 'Crear referencias',
		value: 'CreateReferences',
	},
	UpdateReferences: {
		name: 'Editar referencias',
		value: 'UpdateReferences',
	},
	ReadResources: {
		name: 'Ver insumos',
		value: 'ReadResources',
	},
	CreateResources: {
		name: 'Crear insumos',
		value: 'CreateResources',
	},
	UpdateResources: {
		name: 'Editar insumos',
		value: 'UpdateResources',
	},
	ReadSuppliers: {
		name: 'Ver proveedores',
		value: 'ReadSuppliers',
	},
	CreateSuppliers: {
		name: 'Crear proveedores',
		value: 'CreateSuppliers',
	},
	ReadCorte: {
		name: 'Ver tareas corte',
		value: 'ReadCorte',
	},
	UpdateCorte: {
		name: 'Editar tareas corte',
		value: 'UpdateCorte',
	},
	ReadRoles: {
		name: 'Ver roles',
		value: 'ReadRoles',
	},
	CreateRoles: {
		name: 'Crear roles',
		value: 'CreateRoles',
	},
	UpdateRoles: {
		name: 'Editar roles',
		value: 'UpdateRoles',
	},
	StartOrder: {
		name: 'Empezar orden',
		value: 'StartOrder',
	},
	UpdateSuppliers: {
		name: 'Editar proveedores',
		value: 'UpdateSuppliers',
	},
	UpdateTimesReferences: {
		name: 'Editar tiempos productivos',
		value: 'UpdateTimesReferences',
	},
};
