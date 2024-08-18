import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_colors type
 */
export type VytexColor<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_colors',
	{
		id: number;
		name: string | null;
		code: string | null;
		hex: string | null;
		deleted_at: string | null;
		created_at: string | null;
		updated_at: string | null;
	}
>;
