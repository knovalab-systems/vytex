import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readResources } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

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
			fields: ['id', 'key', 'name', 'cost', 'color_id', 'supplier_id', 'code', 'deleted_at'],
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
