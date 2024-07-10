import type {
	MergeCoreCollection,
	VytexColor,
	VytexFabricsBySize,
	VytexImage,
	VytexResourcesBySize,
	VytexSize,
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
		key: string | null;
		reference: string | null;
		front: VytexImage<Schema[]> | null;
		back: VytexImage<Schema[]> | null;
		deleted_at: string | null;
		created_at: string | null;
		create_by: string | null;
		user: VytexUser<Schema[]> | null;
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
		create_by: string | null;
		color: VytexColor<Schema[]> | null;
	}
>;

export type VytexCreateReference<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		reference: string | null;
		create_by: string | null;
		front: string | null;
		back: string | null;
		colors: {
			color: number | null;
			fabrics: VytexFabricsBySize[];
			resources: VytexResourcesBySize[];
		}[];
	}
>;
