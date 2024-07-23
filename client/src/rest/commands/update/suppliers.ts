import type { VytexSupplier } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type UpdateSupplierOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexSupplier<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update multiple existing supplier.
 *
 * @param keys The primary key of the suppliers
 * @param item The supplier data to update
 * @param query Optional return data query
 *
 * @returns Returns the supplier object for the updated suppliers.
 * @throws Will throw if keys is empty
 */
export const updateSuppliers =
	<Schema extends object, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		keys: VytexSupplier<Schema>['id'][],
		item: Partial<VytexSupplier<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateSupplierOutput<Schema, TQuery>[], Schema> =>
	() => {
		throwIfEmpty(String(keys), 'Key cannot be empty');
		return {
			path: '/suppliers',
			params: query ?? {},
			body: JSON.stringify({ keys, data: item }),
			method: 'PATCH',
		};
	};

/**
 * Update an existing supplier.
 *
 * @param key The primary key of the supplier
 * @param item The supplier data to update
 * @param query Optional return data query
 *
 * @returns Returns the supplier object for the updated supplier.
 * @throws Will throw if key is empty
 */
export const updateSupplier =
	<Schema extends object, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		key: VytexSupplier<Schema>['id'],
		item: Partial<VytexSupplier<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateSupplierOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/suppliers/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
