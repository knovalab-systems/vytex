import type {
	MergeCoreCollection,
	VytexColor,
	VytexFabric,
	VytexFabricsBySize,
	VytexImage,
	VytexResource,
	VytexResourcesBySize,
	VytexUser,
} from '../index.js';

/**
 * vytex_reference type
 */
export type VytexReference<Schema extends object> = MergeCoreCollection<
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
		colors: {
			color_id: number | null;
			color: VytexColor<Schema[]> | null;
			fabrics: VytexFabric<Schema[]>[];
			resources: VytexResource<Schema[]>[];
		}[];
	}
>;

export type VytexColorByReference<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		key: string | null;
		reference_id: string | null;
		reference: VytexReference<Schema[]> | null;
		deleted_at: string | null;
		created_at: string | null;
		color: VytexColor<Schema[]> | null;
	}
>;

export type VytexCreateReference<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		code: string | null;
		front: string | null;
		back: string | null;
		colors: {
			color: number | null;
			fabrics: VytexFabricsBySize[];
			resources: VytexResourcesBySize[];
		}[];
	}
>;
