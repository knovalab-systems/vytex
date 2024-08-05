import type { VytexResource } from '../../../schema/resource.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadResourceOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexResource<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all resources that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit resources objects. If no items are available, data will be an empty array.
 */
export const readResources =
	<Schema extends object, const TQuery extends Query<Schema, VytexResource<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadResourceOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/resources',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing resource by primary key.
 *
 * @param key The primary key of the resource
 * @param query  The query parameters
 * @returns Returns the requested resource object.
 * @throws Will throw if key is empty
 */
export const readResource =
	<Schema extends object, const TQuery extends Query<Schema, VytexResource<Schema>>>(
		key: VytexResource<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadResourceOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/resources/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};
