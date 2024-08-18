import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_image type
 */
export type VytexImage<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_images',
	{
		id: string;
		location: string | null;
	}
>;
