import type { VytexCustom } from '../../../schema/custom.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadCustomOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexCustom<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all customs that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit customs objects. If no items are available, data will be an empty array.
 */
export const readCustoms =
	<Schema extends object, const TQuery extends Query<Schema, VytexCustom<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadCustomOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/customs',
		params: query ?? {},
		method: 'GET',
	});
