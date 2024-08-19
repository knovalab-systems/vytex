import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readFabric, readFabrics } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

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
			fields: ['id', 'name', 'cost', 'color_id', 'code', 'deleted_at', 'supplier_id'],
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

export function getFabricQuery(id: number) {
	return queryOptions({
		queryKey: ['getFabric', id],
		queryFn: () => getFabric(id),
	});
}

async function getFabric(id: number) {
	return await client.request(readFabric(id));
}

export type GetFabricType = Awaited<ReturnType<typeof getFabric>>;
