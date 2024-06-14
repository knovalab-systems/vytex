import type { VytexColor } from '../../../schema/color.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

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
