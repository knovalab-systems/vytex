import { queryOptions } from '@tanstack/solid-query';
import { createOrder, readReferences } from '@vytex/client';
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
				colors: {
					deleted_at: {
						_null: true,
					},
				},
			},
		}),
	);
}

export type RefByOrderCreate = Awaited<ReturnType<typeof getRefByOrderCreate>>;
