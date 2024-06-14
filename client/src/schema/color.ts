import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_colors type
 */
export type VytexColor<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_colors',
	{
		id: number;
		name: string | null;
		code: string | null;
		hex: string | null;
		delete_at: string | null;
		create_at: string | null;
		update_at: string | null;
	}
>;
