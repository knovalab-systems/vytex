import type { VytexReference } from '../../../schema/reference';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadReferenceOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexReference<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all references that exist in Vytex.
 * @param query The query parameters
 * @returns  An array of up to limit references objects. If no items are available, data will be an empty array.
 */
export const readReferences =
	<Schema, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadReferenceOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/references',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing reference by primary key.
 *
 * @param key The primary key of the reference
 * @param query  The query parameters
 * @returns Returns the requested reference object.
 * @throws Will throw if key is empty
 */
export const readReference =
	<Schema, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		key: VytexReference<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadReferenceOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/references/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};

export const readReferenceImage =
	<Schema, const TQuery extends Query<Schema, VytexReference<Schema>>>(
		key: VytexReference<Schema>['id'],
		query?: TQuery,
	): RestCommand<Blob, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `references/images/${key}`,
			params: query ?? {},
			method: 'GET',
			onResponse: response => response.blob(),
		};
	};
