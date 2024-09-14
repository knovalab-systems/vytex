import type { VytexOrderState } from '../../../schema/orderState.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadOrderStateOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexOrderState<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all order status that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit order status objects. If no items are available, data will be an empty array.
 */
export const readOrderStatus =
	<Schema, const TQuery extends Query<Schema, VytexOrderState<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadOrderStateOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/order-status',
		params: query ?? {},
		method: 'GET',
	});
