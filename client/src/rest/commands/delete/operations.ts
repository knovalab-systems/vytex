import type { DirectusOperation } from '../../../schema/operation.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

/**
 * Delete multiple existing operations.
 * @param keys
 * @returns
 * @throws Will throw if keys is empty
 */
export const deleteOperations =
	<Schema>(keys: DirectusOperation<Schema>['id'][]): RestCommand<void, Schema> =>
	() => {
		throwIfEmpty(keys, 'Keys cannot be empty');

		return {
			path: '/operations',
			body: JSON.stringify(keys),
			method: 'DELETE',
		};
	};

/**
 * Delete an existing operation.
 * @param key
 * @returns
 * @throws Will throw if key is empty
 */
export const deleteOperation =
	<Schema>(key: DirectusOperation<Schema>['id']): RestCommand<void, Schema> =>
	() => {
		throwIfEmpty(key, 'Key cannot be empty');

		return {
			path: `/operations/${key}`,
			method: 'DELETE',
		};
	};
