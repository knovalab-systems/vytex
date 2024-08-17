import type { VytexCustom } from '../../../schema/custom.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadCustomOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexCustom<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all customs that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit customs objects. If no items are available, data will be an empty array.
 */
export const readCustoms =
	<Schema, const TQuery extends Query<Schema, VytexCustom<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadCustomOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/customs',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing custom by primary key.
 *
 * @param key The primary key of the custom
 * @param query  The query parameters
 * @returns Returns the requested custom object.
 * @throws Will throw if key is empty
 */
export const readCustom =
	<Schema, const TQuery extends Query<Schema, VytexCustom<Schema>>>(
		key: VytexCustom<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadCustomOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/customs/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};
