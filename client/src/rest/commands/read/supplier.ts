import type { VytexSupplier } from '../../../schema/supplier.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadSupplierOutput<
	Schema extends object,
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
	<Schema extends object, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadSupplierOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/suppliers',
		params: query ?? {},
		method: 'GET',
	});
