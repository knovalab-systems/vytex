import type { VytexColor } from '../../../schema/color.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadColorOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexColor<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all colors that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit colors objects. If no items are available, data will be an empty array.
 */
export const readColors =
	<Schema extends object, const TQuery extends Query<Schema, VytexColor<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadColorOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/colors',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing color by primary key.
 *
 * @param key The primary key of the color
 * @param query The query parameters
 *
 * @returns Returns the requested color object.
 * @throws Will throw if key is empty
 */
export const readColor =
<Schema extends object, const TQuery extends Query<Schema, VytexColor<Schema>>>(
	key: VytexColor<Schema>['id'],
	query?: TQuery,
): RestCommand<ReadColorOutput<Schema, TQuery>, Schema> =>
() => {
	throwIfEmpty(String(key), 'Key cannot be empty');

	return {
		path: `/colors/${key}`,
		params: query ?? {},
		method: 'GET',
	};
};