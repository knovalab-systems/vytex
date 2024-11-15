import type { MergeCoreCollection } from '../index.js';
import type { VytexRole } from './role.js';

export type DirectusPermission<Schema = any> = MergeCoreCollection<
	Schema,
	'directus_permissions',
	{
		id: number;
		role: VytexRole<Schema> | string | null;
		collection: string; // TODO keyof complete schema
		action: string;
		permissions: Record<string, any> | null;
		validation: Record<string, any> | null;
		presets: Record<string, any> | null;
		fields: string[] | null;
	}
>;
