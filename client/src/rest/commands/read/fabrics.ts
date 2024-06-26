import type { VytexFabric } from '../../../schema/fabric.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type ReadFabricOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexFabric<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all fabrics that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit fabrics objects. If no items are available, data will be an empty array.
 */
export const readFabrics =
	<Schema extends object, const TQuery extends Query<Schema, VytexFabric<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadFabricOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/fabrics',
		params: query ?? {},
		method: 'GET',
	});
