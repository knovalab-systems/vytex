import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readResources } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/constants/http';

export function getResourcesQuery(page: number) {
	return queryOptions({
		queryKey: ['getResources', page],
		queryFn: () => getResources(page),
	});
}

async function getResources(page: number) {
	return await client.request(
		readResources({
			page: page,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetResourcesType = Awaited<ReturnType<typeof getResources>>;

export function countResourcesQuery() {
	return queryOptions({
		queryKey: ['countResources'],
		queryFn: () => countResources(),
	});
}

async function countResources() {
	return await client.request(
		aggregate('vytex_resources', {
			aggregate: {
				count: '*',
			},
		}),
	);
}
