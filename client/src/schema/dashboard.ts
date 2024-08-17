import type { MergeCoreCollection } from '../index.js';
import type { VytexUser } from './user.js';

export type DirectusDashboard<Schema = any> = MergeCoreCollection<
	Schema,
	'directus_dashboards',
	{
		id: string;
		name: string;
		icon: string;
		note: string | null;
		date_created: 'datetime' | null;
		user_created: VytexUser<Schema> | string | null;
		color: string | null;
	}
>;
