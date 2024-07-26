import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readCustom, readCustoms } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getCustomsQuery(page: number) {
	return queryOptions({
		queryKey: ['getCustoms', page],
		queryFn: () => getCustoms(page),
	});
}

async function getCustoms(page: number) {
	return await client.request(
		readCustoms({
			page: page,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetCustomsType = Awaited<ReturnType<typeof getCustoms>>;

export function countCustomsQuery() {
	return queryOptions({
		queryKey: ['countCustoms'],
		queryFn: () => countCustoms(),
	});
}

async function countCustoms() {
	return await client.request(
		aggregate('vytex_customs', {
			aggregate: {
				count: '*',
			},
		}),
	);
}

export function getCustomQuery(id: number) {
	return queryOptions({
		queryFn: () => getCustom(id),
		queryKey: ['getCustom', id],
	});
}

async function getCustom(id: number) {
	return await client.request(readCustom(id));
}

export type GetCustomType = Awaited<ReturnType<typeof getCustom>>;
