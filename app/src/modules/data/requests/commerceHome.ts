import { queryOptions } from '@tanstack/solid-query';
import { aggregate } from '@vytex/client';
import { client } from '~/lib/client';

export function countCustomsByClientQuery() {
	return queryOptions({
		queryKey: ['countCustomsByClient'],
		queryFn: () => countCustomsByClient(),
	});
}

async function countCustomsByClient() {
	return client.request(
		aggregate('vytex_customs', {
			aggregate: {
				count: ['id', 'client'],
			},
			groupBy: ['client'],
		}),
	);
}

export type CountCustomsByClientType = Awaited<ReturnType<typeof countCustomsByClient>>;

export function countOrdersBystateQuery() {
	return queryOptions({
		queryKey: ['countOrdersBystate'],
		queryFn: () => countOrdersBystate(),
	});
}

async function countOrdersBystate() {
	return client.request(
		aggregate('vytex_orders', {
			aggregate: {
				count: ['id', 'created_at', 'started_at'],
			},
		}),
	);
}

export type CountOrdersBystateType = Awaited<ReturnType<typeof countOrdersBystate>>;

export function countOrdersBystateIdQuery() {
	return queryOptions({
		queryKey: ['countOrdersBystateId'],
		queryFn: () => countOrdersBystateId(),
	});
}

async function countOrdersBystateId() {
	return client.request(
		aggregate('vytex_orders', {
			aggregate: {
				count: '*',
			},
			groupBy: ['order_state_id'],
		}),
	);
}

export type CountOrdersBystateIdType = Awaited<ReturnType<typeof countOrdersBystateId>>;
