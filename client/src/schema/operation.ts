import type { MergeCoreCollection } from '../index.js';
import type { DirectusFlow } from './flow.js';
import type { VytexUser } from './user.js';

export type DirectusOperation<Schema extends object> = MergeCoreCollection<
	Schema,
	'directus_operations',
	{
		id: string;
		name: string | null;
		key: string;
		type: string;
		position_x: number;
		position_y: number;
		timestamp: string;
		options: Record<string, any> | null;
		resolve: DirectusOperation<Schema> | string | null;
		reject: DirectusOperation<Schema> | string | null;
		flow: DirectusFlow<Schema> | string;
		date_created: 'datetime' | null;
		user_created: VytexUser<Schema> | string | null;
	}
>;
