import type { VytexResource } from '../../../schema';
import type { ApplyQueryFields, Query } from '../../../types';
import type { RestCommand } from '../../types';
import { throwIfEmpty } from '../../utils';

export type UpdateResourceOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexResource<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update an existing resource.
 *
 * @param key The primary key of the resource
 * @param item The resource data to update
 * @param query Optional return data query
 *
 * @returns Returns the resource object for the updated resource.
 * @throws Will throw if key is empty
 */
export const updateResource =
	<Schema extends object, const TQuery extends Query<Schema, VytexResource<Schema>>>(
		key: VytexResource<Schema>['id'],
		item: Partial<VytexResource<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateResourceOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/resources/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};
