import type { VytexColor } from '../../../schema/color.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type UpdateColorOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexColor<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update an existing color.
 *
 * @param key The primary key of the color
 * @param item The color data to update
 * @param query Optional return data query
 *
 * @returns Returns the color object for the updated color.
 * @throws Will throw if key is empty
 */
export const updateColor =
	<Schema extends object, const TQuery extends Query<Schema, VytexColor<Schema>>>(
		key: VytexColor<Schema>['id'],
		item: Partial<VytexColor<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateColorOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/colors/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
