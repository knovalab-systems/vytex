import type { MergeCoreCollection } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_fabricsV type
 */
export type VytexFabric<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_fabrics',
	{
		id: number;
		cost: number | null;
		fabricId: number | null;
		fabric: VytexFabricBase<Schema[]>;
		delete_at: string | null;
		create_at: string | null;
	}
>;

/**
 * vytex_fabrics type
 */
export type VytexFabricBase<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_fabrics',
	{
		id: number;
		name: string | null;
		code: string | null;
		colorId: number | null;
		color: VytexColor<Schema[]>;
	}
>;
