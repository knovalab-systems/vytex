import type { VytexFabric } from '../../../schema/fabric.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadFabricOutput<
	Schema,
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
	<Schema, const TQuery extends Query<Schema, VytexFabric<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadFabricOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/fabrics',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing fabric by primary key.
 *
 * @param key The primary key of the fabric
 * @param query  The query parameters
 * @returns Returns the requested fabric object.
 * @throws Will throw if key is empty
 */
export const readFabric =
	<Schema, const TQuery extends Query<Schema, VytexFabric<Schema>>>(
		key: VytexFabric<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadFabricOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/fabrics/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};
