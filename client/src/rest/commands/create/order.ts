import type { CoreSchema } from '../../../schema/core.js';
import type { VytexOrder } from '../../../schema/order.js';
import type { ApplyQueryFields, DeepPartial, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateOrderOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexOrder<Schema>,
> = ApplyQueryFields<VytexOrder<CoreSchema>, Item, TQuery['fields']>;

/**
 * Create a new order.
 *
 * @param item The order to create
 * @param query Optional return data query
 *
 * @returns Returns the order object for the created order.
 */
export const createOrder =
	<Schema extends object, const TQuery extends Query<Schema, VytexOrder<Schema>>>(
		item: DeepPartial<VytexOrder<Schema>>,
		query?: TQuery,
	): RestCommand<CreateOrderOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/orders',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
