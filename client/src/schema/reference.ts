import type { MergeCoreCollection, VytexColor, VytexSize, VytexUser } from '../index.js';

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
		delete_at: string | null;
		create_at: string | null;
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
		delete_at: string | null;
		create_at: string | null;
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
		colors: {
			color: string | null;
			fabrics: VytexSize & { fabric: string | null }[];
			resources: VytexSize & { resource: string | null }[];
		}[];
	}
>;
