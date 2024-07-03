import type { VytexImage } from '../../../schema/image.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateImageOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexImage<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Create a new image.
 *
 * @param item The image to create
 * @param query Optional return data query
 *
 * @returns Returns the image object for the created image.
 */
export const createImage =
	<Schema extends object, const TQuery extends Query<Schema, VytexImage<Schema>>>(
		item: Partial<VytexImage<Schema>>,
		query?: TQuery,
	): RestCommand<CreateImageOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/images',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
