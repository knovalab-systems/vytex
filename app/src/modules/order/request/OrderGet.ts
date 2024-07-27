import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readOrders } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getOrdersQuery(page: number) {
	return queryOptions({
		queryKey: ['getOrders', page],
		queryFn: () => getOrders(page),
	});
}

async function getOrders(page: number) {
	return await client.request(
		readOrders({
			page: page,
			limit: QUERY_LIMIT,
		}),
	);
}

export type GetOrdersType = Awaited<ReturnType<typeof getOrders>>;

export function countOrdersQuery() {
	return queryOptions({
		queryKey: ['countOrders'],
		queryFn: () => countOrders(),
	});
}

async function countOrders() {
	return await client.request(
		aggregate('vytex_orders', {
			aggregate: {
				count: '*',
			},
		}),
	);
}
