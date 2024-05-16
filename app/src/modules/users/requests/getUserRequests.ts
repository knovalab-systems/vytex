import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readUsers } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constants';

export function getUsersQuery(name: string, username: string, roleId: string, status: string, page: number) {
	return queryOptions({
		queryFn: () => getUsers(name, username, roleId, status, page),
		queryKey: ['getusers', name, username, roleId, status, page],
	});
}

async function getUsers(name: string, username: string, roleId: string, status: string, page: number) {
	return await client.request(
		readUsers({
			page: page | 0,
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
				delete_at: {
					_eq: status,
				},
			},
		}),
	);
}

export function countUsersQuery() {
	return queryOptions({
		queryFn: countUsers,
		queryKey: ['countUsers'],
	});
}

async function countUsers() {
	return await client.request(
		aggregate('vytex_users', {
			aggregate: { count: '*' },
		}),
	);
}

export type GetUsersType = Awaited<ReturnType<typeof getUsers>> | undefined;
