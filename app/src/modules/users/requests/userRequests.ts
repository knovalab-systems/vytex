import { aggregate, readUsers } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constans';

export async function getUsers(page: number) {
	return await client.request(
		readUsers({
			page: page | 0,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetUsersType = Awaited<ReturnType<typeof getUsers>> | undefined;

export async function countUsers() {
	return await client.request(
		aggregate('vytex_users', {
			aggregate: { count: '*' },
		}),
	);
}
