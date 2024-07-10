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
		password: string | null; // will just be a empty string
		role: string | null; // uuid
		deleted_at: string | null;
		created_at: string | null;
		updated_at: string | null;
	}
>;
