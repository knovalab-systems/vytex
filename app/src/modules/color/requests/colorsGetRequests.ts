import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readColors } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constants';

export function getColorsQuery(page: number) {
	return queryOptions({
		queryKey: ['getColors', page],
		queryFn: () => getColors(page),
	});
}

async function getColors(page: number) {
	return await client.request(
		readColors({
			page: page,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetColorsType = Awaited<ReturnType<typeof getColors>>;

export function countColorsQuery() {
	return queryOptions({
		queryKey: ['countColors'],
		queryFn: () => countColors(),
	});
}

async function countColors() {
	return await client.request(
		aggregate('vytex_colors', {
			aggregate: {
				count: '*',
			},
		}),
	);
}
