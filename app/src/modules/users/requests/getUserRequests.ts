import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readUsers } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constans';

export function getUsersQuery(page: number) {
	return queryOptions({
		queryFn: () => getUsers(page),
		queryKey: ['getusers', page],
	});
}

async function getUsers(page: number) {
	return await client.request(
		readUsers({
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetUsersType = Awaited<ReturnType<typeof getUsers>> | undefined;

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
