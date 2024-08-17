import type {
	MergeCoreCollection,
	VytexColor,
	VytexFabric,
	VytexImage,
	VytexResource,
	VytexSize,
	VytexUser,
} from '../index.js';

/**
 * vytex_reference type
 */
export type VytexReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null; // use for version purpose n erp interface
		front: VytexImage<Schema[]> | null;
		back: VytexImage<Schema[]> | null;
		deleted_at: string | null;
		created_at: string | null;
		created_by: string | null;
		user: VytexUser<Schema[]> | null;
		colors: VytexColorByReference<Schema[]>[] | null;
	}
>;

export type VytexColorByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		reference_id: number | null;
		deleted_at: string | null;
		created_at: string | null;
		color_id: number | null;
		color: VytexColor<Schema[]> | null;
		fabrics: VytexFabricByReference<Schema>[] | null;
		resources: VytexResourceByReference<Schema>[] | null;
	}
>;

export type VytexResourceByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null;
		deleted_at: string | null;
		color_by_reference_id: number | null;
		resource_id: number | null;
		resource: VytexResource<Schema> | null;
	} & VytexSize
>;

export type VytexFabricByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null;
		deleted_at: string | null;
		color_by_reference_id: number | null;
		fabric_id: number | null;
		fabric: VytexFabric<Schema> | null;
	} & VytexSize
>;
