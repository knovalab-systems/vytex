import type { MergeCoreCollection } from '../index.js';
import type { VytexRole } from './role.js';
import type { VytexUser } from './user.js';

export type DirectusPreset<Schema = any> = MergeCoreCollection<
	Schema,
	'directus_presets',
	{
		id: number;
		bookmark: string | null;
		user: VytexUser<Schema> | string | null;
		role: VytexRole<Schema> | string | null;
		collection: string | null; // TODO keyof complete schema
		search: string | null;
		layout: string | null;
		layout_query: Record<string, any> | null;
		layout_options: Record<string, any> | null;
		refresh_interval: number | null;
		filter: Record<string, any> | null;
		icon: string | null;
		color: string | null;
	}
>;
