import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readOrder, readOrders } from '@vytex/client';
import dayjs from 'dayjs';
import { QUERY_LIMIT } from '~/constants/http';
import { SIZES } from '~/constants/sizes';
import { client } from '~/lib/client';
import { getBetweenDay } from '~/lib/parseTime';
import type { OrderFilter } from '~/types/filter';

export function getOrdersQuery(page: number, filters: OrderFilter) {
	return queryOptions({
		queryKey: ['getOrders', page, filters],
		queryFn: () => getOrders(page, filters),
	});
}

async function getOrders(page: number, filters: OrderFilter) {
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
			...doFilters(filters),
		}),
	);
}

export type GetOrdersType = Awaited<ReturnType<typeof getOrders>>;

export function countOrdersQuery(filters: OrderFilter) {
	return queryOptions({
		queryKey: ['countOrders', filters],
		queryFn: () => countOrders(filters),
	});
}

async function countOrders(filters: OrderFilter) {
	return await client.request(
		aggregate('vytex_orders', {
			aggregate: {
				count: '*',
			},
			query: {
				...doFilters(filters),
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

function doFilters(filters: OrderFilter) {
	if (Object.keys(filters).length === 0) {
		return;
	}

	return {
		filter: {
			...(filters.canceledDate && {
				canceled_at: {
					_between: getBetweenDay(dayjs(filters.canceledDate)),
				},
			}),
			...(filters.finishedDate && {
				finished_at: {
					_between: getBetweenDay(dayjs(filters.finishedDate)),
				},
			}),
			...(filters.createdDate && {
				created_at: {
					_between: getBetweenDay(dayjs(filters.createdDate)),
				},
			}),
			...(filters.startedDate && {
				started_at: {
					_between: getBetweenDay(dayjs(filters.startedDate)),
				},
			}),
			...(filters.status &&
				filters.status.length > 0 && {
					order_state_id: {
						_in: filters.status,
					},
				}),
		},
	};
}
