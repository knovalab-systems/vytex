import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readUser, readUsers } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { UserFilter } from '~/types/filter';

export function getUsersQuery(page: number, filters: UserFilter) {
	return queryOptions({
		queryFn: () => getUsers(page, filters),
		queryKey: ['getUsers', filters],
	});
}

async function getUsers(page: number, filters: UserFilter) {
	return await client.request(
		readUsers({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'name', 'username', 'deleted_at', 'role_id'],
			filter: doFilters(filters),
		}),
	);
}

export function countUsersQuery(filters: UserFilter) {
	return queryOptions({
		queryFn: () => countUsers(filters),
		queryKey: ['countUsers', filters],
	});
}

async function countUsers(filters: UserFilter) {
	return await client.request(
		aggregate('vytex_users', {
			aggregate: { count: '*' },
			query: {
				filter: doFilters(filters),
			},
		}),
	);
}

export type GetUsersType = Awaited<ReturnType<typeof getUsers>>;

export function getUserQuery(id: string) {
	return queryOptions({
		queryFn: () => getUser(id),
		queryKey: ['getUser', id],
	});
}

async function getUser(id: string) {
	return await client.request(
		readUser(id, {
			fields: ['id', 'name', 'username', 'role_id', 'created_at', 'updated_at', 'deleted_at', { role: ['name'] }],
		}),
	);
}

export type GetUserType = Awaited<ReturnType<typeof getUser>>;

function doFilters(filters: UserFilter) {
	return {
		...(filters.name && {
			name: {
				_contains: filters.name.toLowerCase(),
			},
		}),
		...(filters.username && {
			username: {
				_contains: filters.username.toLowerCase(),
			},
		}),
		...(filters.roles &&
			filters.roles.length > 0 && {
				role_id: {
					_in: filters.roles,
				},
			}),
		...(filters.state && {
			delete_at: {
				_null: filters.state === 'Activo',
			},
		}),
	};
}
