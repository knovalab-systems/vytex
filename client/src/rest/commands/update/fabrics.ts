import type { VytexFabric } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types';
import { throwIfEmpty } from '../../utils';

export type UpdateFabricOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexFabric<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update an existing fabric.
 *
 * @param key The primary key of the fabric
 * @param item The fabric data to update
 * @param query Optional return data query
 *
 * @returns Returns the fabric object for the updated fabric.
 * @throws Will throw if key is empty
 */
export const updateFabric =
	<Schema, const TQuery extends Query<Schema, VytexFabric<Schema>>>(
		key: VytexFabric<Schema>['id'],
		item: Partial<VytexFabric<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateFabricOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/fabrics/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
