import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readFabrics } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constants';

export function getFabricsQuery(page: number) {
	return queryOptions({
		queryKey: ['getFabrics', page],
		queryFn: () => getFabrics(page),
	});
}

async function getFabrics(page: number) {
	return await client.request(
		readFabrics({
			page: page,
			limit: QUERY_LIMIT,
		}),
	);
}

export function countFabricsQuery() {
	return queryOptions({
		queryKey: ['countFabrics'],
		queryFn: () => countFabrics(),
	});
}

async function countFabrics() {
	return await client.request(
		aggregate('vytex_fabrics', {
			aggregate: {
				count: '*',
			},
		}),
	);
}

export type GetFabricsType = Awaited<ReturnType<typeof getFabrics>>;
