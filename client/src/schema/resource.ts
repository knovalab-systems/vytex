import type { MergeCoreCollection, VytexComposition, VytexSupplier } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_resources type
 */
export type VytexResource<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_resources',
	{
		id: number;
		cost: number | null;
		name: string | null;
		code: string | null; // use for version purpose n erp interface
		color_id: number | null;
		color: VytexColor<Schema[]>;
		supplier_id: number | null;
		supplier: VytexSupplier<Schema[]>;
		deleted_at: string | null;
		created_at: string | null;
	}
>;
