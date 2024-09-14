import { updateOrder } from '@vytex/client';
import { client } from '~/lib/client';
import type { Order } from '~/types/core';

export async function updateOrderRequest(id: number, order: Order) {
	return await client.request(updateOrder(id, order));
}
