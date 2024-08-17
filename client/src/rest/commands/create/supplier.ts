import type { VytexSupplier } from '../../../schema/supplier.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types';

export type CreateSupplierOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexSupplier<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Create a new supplier.
 *
 * @param item The supplier to create
 * @param query Optional return data query
 *
 * @returns Returns the supplier object for the created supplier.
 */
export const createSupplier =
	<Schema, const TQuery extends Query<Schema, VytexSupplier<Schema>>>(
		item: Partial<VytexSupplier<Schema>>,
		query?: TQuery,
	): RestCommand<CreateSupplierOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/suppliers',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
