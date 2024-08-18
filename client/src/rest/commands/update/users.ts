import type { VytexUser } from '../../../schema/user.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type UpdateUserOutput<
	Schema,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexUser<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * Update multiple existing users.
 *
 * @param keys The primary key of the users
 * @param item The user data to update
 * @param query Optional return data query
 *
 * @returns Returns the user objects for the updated users.
 * @throws Will throw if keys is empty
 */
export const updateUsers =
	<Schema, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		keys: VytexUser<Schema>['id'][],
		item: Partial<VytexUser<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateUserOutput<Schema, TQuery>[], Schema> =>
	() => {
		throwIfEmpty(keys, 'Keys cannot be empty');

		return {
			path: '/users',
			params: query ?? {},
			body: JSON.stringify({ keys, data: item }),
			method: 'PATCH',
		};
	};

/**
 * Update an existing user.
 *
 * @param key The primary key of the user
 * @param item The user data to update
 * @param query Optional return data query
 *
 * @returns Returns the user object for the updated user.
 * @throws Will throw if key is empty
 */
export const updateUser =
	<Schema, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		key: VytexUser<Schema>['id'],
		item: Partial<VytexUser<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateUserOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(key, 'Key cannot be empty');

		return {
			path: `/users/${key}`,
			params: query ?? {},
			body: JSON.stringify(item),
			method: 'PATCH',
		};
	};

/**
 * Update the authenticated user.
 *
 * @param item The user data to update
 * @param query Optional return data query
 *
 * @returns Returns the updated user object for the authenticated user.
 */
export const updateMe =
	<Schema, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		item: Partial<VytexUser<Schema>>,
		query?: TQuery,
	): RestCommand<UpdateUserOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/users/me',
		params: query ?? {},
		body: JSON.stringify(item),
		method: 'PATCH',
	});
