import type { MergeCoreCollection } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_resources type
 */
export type VytexResource<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_resources',
	{
		id: number;
		key: string; // uuid for version purpose
		cost: number | null;
		name: string | null;
		code: string | null;
		color_id: number | null;
		color: VytexColor<Schema[]>;
		deleted_at: string | null;
		created_at: string | null;
	}
>;
