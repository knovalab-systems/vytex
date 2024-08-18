import type { VytexSupplier } from '../../../schema/supplier.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadSupplierOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexSupplier<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all suppliers that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit suppliers objects. If no items are available, data will be an empty array.
 */
export const readSuppliers =
	<Schema, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadSupplierOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/suppliers',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing supplier by primary key.
 *
 * @param key The primary key of the supplier
 * @param query  The query parameters
 * @returns Returns the requested supplier object.
 * @throws Will throw if key is empty
 */
export const readSupplier =
	<Schema, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		key: VytexSupplier<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadSupplierOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/suppliers/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};
