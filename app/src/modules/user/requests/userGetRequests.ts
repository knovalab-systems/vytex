import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readUser, readUsers } from '@vytex/client';
import { client } from '~/lib/client';
import { QUERY_LIMIT } from '~/constants/http';

export function getUsersQuery(name: string, username: string, roleId: string, status: string, page: number) {
	return queryOptions({
		queryFn: () => getUsers(name, username, roleId, status, page),
		queryKey: ['getUsers', name, username, roleId, status, page],
	});
}

async function getUsers(name: string, username: string, roleId: string, status: string, page: number) {
	return await client.request(
		readUsers({
			page: page,
			limit: QUERY_LIMIT,
			filter: {
				name: {
					_eq: name.toLowerCase(),
				},
				username: {
					_eq: username.toLowerCase(),
				},
				role: {
					_eq: roleId,
				},
				deleted_at: {
					_eq: status,
				},
			},
		}),
	);
}

export function countUsersQuery(name: string, username: string, roleId: string, status: string) {
	return queryOptions({
		queryFn: () => countUsers(name, username, roleId, status),
		queryKey: ['countUsers', name, username, roleId, status],
	});
}

async function countUsers(name: string, username: string, roleId: string, status: string) {
	return await client.request(
		aggregate('vytex_users', {
			aggregate: { count: '*' },
			query: {
				filter: {
					name: {
						_eq: name.toLowerCase(),
					},
					username: {
						_eq: username.toLowerCase(),
					},
					role: {
						_eq: roleId,
					},
					deleted_at: {
						_eq: status,
					},
				},
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
	return await client.request(readUser(id));
}

export type GetUserType = Awaited<ReturnType<typeof getUser>>;
