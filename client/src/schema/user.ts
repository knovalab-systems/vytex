import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_users type
 */
export type VytexUser<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_users',
	{
		id: string; // uuid
		name: string | null;
		username: string | null;
		password: string | null; // will just be *s
		role: number | null; // pending
		delete_at: string | null;
		create_at: string | null;
		update_at: string | null;
	}
>;
