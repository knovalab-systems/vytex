import type { VytexOrder } from '../../../schema/order.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadOrderOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexOrder<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all orders that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit orders objects. If no items are available, data will be an empty array.
 */
export const readOrders =
	<Schema extends object, const TQuery extends Query<Schema, VytexOrder<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadOrderOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/orders',
		params: query ?? {},
		method: 'GET',
	});
