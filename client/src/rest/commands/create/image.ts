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
 * @param data Formdata object
 * @param query The query parameters
 *
 * @returns Returns the image object for the uploaded image, or an array of image objects if multiple images were uploaded at once.
 */
export const uploadImages =
	<Schema extends object, const TQuery extends Query<Schema, VytexImage<Schema>>>(
		data: FormData,
		query?: TQuery,
	): RestCommand<CreateImageOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/images',
		method: 'POST',
		body: data,
		params: query ?? {},
		headers: { 'Content-Type': 'multipart/form-data' },
	});
