import type { VytexOrder } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types';
import { throwIfEmpty } from '../../utils';

export type UpdateOrderOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexOrder<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update an existing order.
 *
 * @param key The primary key of the order
 * @param item The order data to update
 * @param query Optional return data query
 *
 * @returns Returns the order object for the updated order.
 * @throws Will throw if key is empty
 */
export const updateOrder =
	<Schema, const TQuery extends Query<Schema, VytexOrder<Schema>>>(
		key: VytexOrder<Schema>['id'],
		item: Partial<VytexOrder<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateOrderOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/orders/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
