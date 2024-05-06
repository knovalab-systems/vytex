import { readUsers } from '@vytex/client';
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
