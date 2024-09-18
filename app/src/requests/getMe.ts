import { queryOptions } from '@tanstack/solid-query';
import { readMe } from '@vytex/client';
import { client } from '~/lib/client';

export const getMeQueryKey = 'getMe';

export function getMyUserQuery() {
	return queryOptions({
		queryFn: getMe,
		queryKey: [getMeQueryKey],
		gcTime: Number.POSITIVE_INFINITY,
	});
}

async function getMe() {
	return await client.request(readMe({ fields: [{ role: ['id', 'code', 'policies'] }] }));
}

export type getMeType = Awaited<ReturnType<typeof getMe>>;
