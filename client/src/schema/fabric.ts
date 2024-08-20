import type { MergeCoreCollection, VytexComposition, VytexSupplier } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_fabrics type
 */
export type VytexFabric<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_fabrics',
	{
		id: number;
		cost: number | null;
		name: string | null;
		code: string | null; // use for version purpose n erp interface
		color_id: number | null;
		color: VytexColor<Schema> | null;
		supplier_id: number | null;
		supplier: VytexSupplier<Schema> | null;
		composition_id: number | null;
		composition: VytexComposition<Schema> | null;
		deleted_at: string | null;
		created_at: string | null;
	}
>;
