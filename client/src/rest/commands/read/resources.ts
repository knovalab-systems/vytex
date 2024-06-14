import type { VytexResource } from '../../../schema/resource.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadResourceOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexResource<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all resources that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit resources objects. If no items are available, data will be an empty array.
 */
export const readResources =
	<Schema extends object, const TQuery extends Query<Schema, VytexResource<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadResourceOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/resources',
		params: query ?? {},
		method: 'GET',
	});
