import type { MergeCoreCollection } from '../index.js';
import type { VytexColor } from './color.js';

/**
 * vytex_resourcesV type
 */
export type VytexResource<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_resources',
	{
		id: number;
		cost: number | null;
		resourceId: number | null;
		resource: VytexResourceBase<Schema[]>;
		delete_at: string | null;
		create_at: string | null;
	}
>;

/**
 * vytex_resources type
 */
export type VytexResourceBase<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_resources',
	{
		id: number;
		name: string | null;
		code: string | null;
		colorId: number | null;
		color: VytexColor<Schema[]>;
	}
>;
