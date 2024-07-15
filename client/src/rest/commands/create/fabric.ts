import type { VytexFabric } from '../../../schema/fabric.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateFabricOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexFabric<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Create a new fabric.
 *
 * @param item The fabric to create
 * @param query Optional return data query
 *
 * @returns Returns the fabric object for the created fabric.
 */
export const createFabric =
	<Schema extends object, const TQuery extends Query<Schema, VytexFabric<Schema>>>(
		item: Partial<VytexFabric<Schema>>,
		query?: TQuery,
	): RestCommand<CreateFabricOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/fabrics',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
