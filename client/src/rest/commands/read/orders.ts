import type { VytexOrder } from '../../../schema/order.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadOrderOutput<
	Schema,
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
	<Schema, const TQuery extends Query<Schema, VytexOrder<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadOrderOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/orders',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing order by primary key.
 *
 * @param key The primary key of the order
 * @param query The query parameters
 *
 * @returns Returns the requested order object.
 * @throws Will throw if key is empty
 */
export const readOrder =
	<Schema, const TQuery extends Query<Schema, VytexOrder<Schema>>>(
		key: VytexOrder<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadOrderOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/orders/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};
