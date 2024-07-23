import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readSupplier, readSuppliers } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getSuppliersQuery(page: number) {
	return queryOptions({
		queryKey: ['getSuppliers', page],
		queryFn: () => getSuppliers(page),
	});
}

async function getSuppliers(page: number) {
	return await client.request(
		readSuppliers({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'nit', 'name', 'brand', 'deleted_at', 'code'],
		}),
	);
}

export type GetSuppliersType = Awaited<ReturnType<typeof getSuppliers>>;

export function countSuppliersQuery() {
	return queryOptions({
		queryKey: ['countSuppliers'],
		queryFn: () => countSuppliers(),
	});
}

async function countSuppliers() {
	return await client.request(
		aggregate('vytex_suppliers', {
			aggregate: {
				count: '*',
			},
		}),
	);
}

export function getSupplierQuery(id: number) {
	return queryOptions({
		queryFn: () => getSupplier(id),
		queryKey: ['getSupplier', id],
	});
}

async function getSupplier(id: number) {
	return await client.request(readSupplier(id));
}

export type GetSupplierType = Awaited<ReturnType<typeof getSupplier>>;
