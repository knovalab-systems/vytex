import { queryOptions } from '@tanstack/solid-query';
import { readColors } from '@vytex/client';
import { client } from '~/utils/client';
import { QUERY_LIMIT } from '~/utils/constants';

export function getColorsQuery(page: number) {
	return queryOptions({
		queryKey: ['colors', page],
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
