import type { MergeCoreCollection, VytexRole } from '../index.js';

/**
 * vytex_users type
 */
export type VytexUser<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_users',
	{
		id: string; // uuid
		name: string | null;
		username: string | null;
		password: string | null; // will just be a empty string
		role_id: string | null; // uuid
		role: VytexRole<Schema> | null;
		deleted_at: string | null;
		created_at: string | null;
		updated_at: string | null;
	}
>;
