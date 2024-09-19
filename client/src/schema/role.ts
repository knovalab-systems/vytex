import type { MergeCoreCollection } from '../index.js';

export type VytexRole<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_roles',
	{
		id: string;
		name: string;
		code: RoleCode;
		policies: VytexPolicy[] | null;
	}
>;

export type RoleCode = 'admin' | 'desginer' | 'propsupervisor' | null;

export type VytexPolicy =
	| 'ReadUsers'
	| 'CreateUsers'
	| 'UpdateUsers'
	| 'ReadColors'
	| 'CreateColors'
	| 'UpdateColors'
	| 'ReadCustoms'
	| 'CreateCustoms'
	| 'UpdateCustoms'
	| 'ReadFabrics'
	| 'CreateFabrics'
	| 'UpdateFabrics'
	| 'ReadOrders'
	| 'CreateOrders'
	| 'UpdateOrders'
	| 'ReadReferences'
	| 'CreateReferences'
	| 'UpdateReferences'
	| 'UpdateTimesReferences'
	| 'ReadResources'
	| 'CreateResources'
	| 'UpdateResources'
	| 'ReadSuppliers'
	| 'CreateSuppliers'
	| 'UpdateSuppliers'
	| 'StartOrder'
	| 'ReadCorte';
