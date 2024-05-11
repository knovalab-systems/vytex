import type { MergeCoreCollection } from '../index.js';
import type { DirectusCollection } from './collection.js';
import type { VytexUser } from './user.js';

export type DirectusVersion<Schema extends object> = MergeCoreCollection<
	Schema,
	'directus_versions',
	{
		id: string;
		key: string;
		name: string | null;
		collection: DirectusCollection<Schema> | string;
		item: string;
		hash: string;
		date_created: 'datetime' | null;
		date_updated: 'datetime' | null;
		user_created: VytexUser<Schema> | string | null;
		user_updated: VytexUser<Schema> | string | null;
	}
>;
