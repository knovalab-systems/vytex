import { queryOptions } from '@tanstack/solid-query';
import { createOrder, readCustom, readReferences } from '@vytex/client';
import { client } from '~/lib/client';
import type { Order } from '~/types/core';

export async function createOrderRequest(order: Order) {
	return await client.request(createOrder(order));
}

export function getRefByOrderCreateQuery() {
	return queryOptions({
		queryFn: getRefByOrderCreate,
		queryKey: ['getRefByOrderCreate'],
	});
}

async function getRefByOrderCreate() {
	return await client.request(
		readReferences({
			limit: -1,
			fields: ['id', 'code', { colors: ['id', 'color_id'] }],
			filter: {
				deleted_at: {
					_null: true,
				},
			},
		}),
	);
}

export type RefByOrderCreate = Awaited<ReturnType<typeof getRefByOrderCreate>>;

export function getCustomForOrderQuery(id: number) {
	return queryOptions({
		queryFn: () => getCustomForOrder(id),
		queryKey: ['getCustom', id],
	});
}

async function getCustomForOrder(id: number) {
	return await client.request(readCustom(id));
}

export type getCustomForOrder = Awaited<ReturnType<typeof getCustomForOrder>>;
