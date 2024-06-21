import type { MergeCoreCollection } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_fabrics type
 */
export type VytexFabric<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_fabrics',
	{
		id: number;
		key: string; // uuid for version purpose
		cost: number | null;
		name: string | null;
		code: string | null;
		colorId: number | null;
		color: VytexColor<Schema[]>;
		delete_at: string | null;
		create_at: string | null;
	}
>;
