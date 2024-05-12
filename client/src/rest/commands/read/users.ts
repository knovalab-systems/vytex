import type { VytexUser } from '../../../schema/user.js';
import type { ApplyQueryFields, Query } from '../../../types/index.js';
import type { RestCommand } from '../../types.js';
import { throwIfEmpty } from '../../utils/index.js';

export type ReadUserOutput<
	Schema extends object,
	TQuery extends Query<Schema, Item>,
	Item extends object = VytexUser<Schema>,
> = ApplyQueryFields<Schema, Item, TQuery['fields']>;

/**
 * List all users that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit user objects. If no items are available, data will be an empty array.
 */
export const readUsers =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/users',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List all disabled users that exist in Vytex.
 *
 * @param query The query parameters
 *
 * @returns An array of up to limit user objects. If no items are available, data will be an empty array.
 *
 */

export const readDisabledUsers =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/users/disabled',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List all enabled users that exist in Vytex.
 * @param quey The query parameters
 * @returns An array of up to limit user objects. If no items are available, data will be an empty array.
 */
export const readEnabledUsers =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>[], Schema> =>
	() => ({
		path: '/users/enabled',
		params: query ?? {},
		method: 'GET',
	});

/**
 * List an existing user by name.
 *
 * @param name The name of the user
 * @param query The query parameters
 *
 * @returns Returns the requested user object.
 * @throws Will throw if name is empty
 */
export const readUserByName =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		name: VytexUser<Schema>['name'],
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>[], Schema> =>
	() => {
		if (!name) {
			throw new Error('Name cannot be empty');
		}
		return {
			path: `/users/name/?name=${encodeURIComponent(name)}`,
			params: query ?? {},
			method: 'GET',
		};
	};

/**
 * List an existing user by username.
 *
 * @param username The username of the user
 * @param query The query parameters
 *
 * @returns Returns the requested user object.
 * @throws Will throw if username is empty
 */
export const readUserByUsername =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		username: VytexUser<Schema>['username'],
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>[], Schema> =>
	() => {
		if (!username) {
			throw new Error('username cannot be empty');
		}
		return {
			path: `/users/username/?username=${encodeURIComponent(username)}`,
			params: query ?? {},
			method: 'GET',
		};
	};

/**
 * List an existing user by primary key.
 *
 * @param key The primary key of the user
 * @param query The query parameters
 *
 * @returns Returns the requested user object.
 * @throws Will throw if key is empty
 */
export const readUser =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		key: VytexUser<Schema>['id'],
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>, Schema> =>
	() => {
		throwIfEmpty(String(key), 'Key cannot be empty');

		return {
			path: `/users/${key}`,
			params: query ?? {},
			method: 'GET',
		};
	};

/**
 * Retrieve the currently authenticated user.
 *
 * @param query The query parameters
 *
 * @returns Returns the user object for the currently authenticated user.
 */
export const readMe =
	<Schema extends object, const TQuery extends Query<Schema, VytexUser<Schema>>>(
		query?: TQuery,
	): RestCommand<ReadUserOutput<Schema, TQuery>, Schema> =>
	() => ({
		path: '/users/me',
		params: query ?? {},
		method: 'GET',
	});
