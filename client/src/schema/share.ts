import type { MergeCoreCollection } from '../index.js';
import type { VytexRole } from './role.js';
import type { VytexUser } from './user.js';

export type DirectusShare<Schema = any> = MergeCoreCollection<
	Schema,
	'directus_shares',
	{
		id: string;
		name: string | null;
		collection: string | null;
		item: string | null;
		role: VytexRole<Schema> | string | null;
		password: string | null;
		user_created: VytexUser<Schema> | string | null;
		date_created: 'datetime' | null;
		date_start: 'datetime' | null;
		date_end: 'datetime' | null;
		times_used: number | null;
		max_uses: number | null;
	}
>;
