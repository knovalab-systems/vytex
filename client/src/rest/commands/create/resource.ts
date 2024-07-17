import type { VytexResource } from '../../../schema/resource.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';

export type CreateResourceOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexResource<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Create a new resource.
 *
 * @param item The resource to create
 * @param query Optional return data query
 *
 * @returns Returns the resource object for the created resource.
 */
export const createResource =
	<Schema extends object, const TQuery extends Query<Schema, VytexResource<Schema>>>(
		item: Partial<VytexResource<Schema>>,
		query?: TQuery,
	): RestCommand<CreateResourceOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/resources',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'POST',
	});
