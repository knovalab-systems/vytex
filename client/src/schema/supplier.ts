import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_suppliers type
 */
export type VytexSupplier<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_suppliers',
	{
		id: number;
		nit: string | null;
		name: string | null;
		brand: string | null;
		code: string | null;
		deleted_at: string | null;
		updated_at: string | null;
		created_at: string | null;
	}
>;
