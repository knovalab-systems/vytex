import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_image type
 */
export type VytexImage<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_images',
	{
		id: string;
		location: string | null;
	}
>;
