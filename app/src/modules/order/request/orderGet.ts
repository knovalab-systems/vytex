import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readOrder, readOrders } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { SIZES } from '~/constants/sizes';
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
			fields: [
				'created_at',
				'canceled_at',
				'started_at',
				'order_state_id',
				'id',
				'custom_id',
				'finished_at',
				{ color_by_reference: ['color_id', { reference: ['code'] }] },
			],
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

export function getOrderStartQuery(id: number) {
	return queryOptions({
		queryKey: ['getOrderStart', id],
		queryFn: () => getOrderStart(id),
	});
}

async function getOrderStart(id: number) {
	return await client.request(
		readOrder(id, {
			fields: [
				'order_state_id',
				'id',
				...SIZES,
				{
					color_by_reference: [
						'id',
						{ fabrics: [...SIZES, { fabric: ['color_id', 'name'] }] },
						{ resources: [...SIZES, { resource: ['color_id', 'name'] }] },
					],
				},
			],
		}),
	);
}

export type GetOrderStart = Awaited<ReturnType<typeof getOrderStart>>;
