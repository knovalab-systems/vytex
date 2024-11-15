import type { DirectusCollection } from '../../../schema/collection.js';
import type { ApplyQueryFields } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadCollectionOutput<Schema, Item extends object = DirectusCollection<Schema>> = ApplyQueryFields<
	Schema,
	Item,
	'*'
>;

/**
 * List the available collections.
 * @returns An array of collection objects.
 */
export const readCollections =
	<Schema>(): RestCommand<ReadCollectionOutput<Schema>[], Schema> =>
	() => ({
		path: '/collections',
		method: 'GET',
	});

/**
 * Retrieve a single collection by table name.
 * @param collection The collection name
 * @returns A collection object.
 * @throws Will throw if collection is empty
 */
export const readCollection =
	<Schema>(collection: DirectusCollection<Schema>['collection']): RestCommand<ReadCollectionOutput<Schema>, Schema> =>
	() => {
		throwIfEmpty(collection, 'Collection cannot be empty');

		return {
			path: `/collections/${collection}`,
			method: 'GET',
		};
	};
