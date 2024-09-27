import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readFabric, readFabrics } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { FabricFilter } from '~/types/filter';

export function getFabricsQuery(page: number, filters: FabricFilter) {
	return queryOptions({
		queryKey: ['getFabrics', page, filters],
		queryFn: () => getFabrics(page, filters),
	});
}

async function getFabrics(page: number, filters: FabricFilter) {
	return await client.request(
		readFabrics({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'name', 'cost', 'color_id', 'code', 'deleted_at', 'supplier_id'],
			filter: doFilters(filters),
		}),
	);
}

export function countFabricsQuery(filters: FabricFilter) {
	return queryOptions({
		queryKey: ['countFabrics', filters],
		queryFn: () => countFabrics(filters),
	});
}

async function countFabrics(filters: FabricFilter) {
	return await client.request(
		aggregate('vytex_fabrics', {
			aggregate: {
				count: '*',
			},
			query: {
				filter: doFilters(filters),
			},
		}),
	);
}

export type GetFabricsType = Awaited<ReturnType<typeof getFabrics>>;

export function getFabricQuery(id: number) {
	return queryOptions({
		queryKey: ['getFabric', id],
		queryFn: () => getFabric(id),
	});
}

async function getFabric(id: number) {
	return await client.request(readFabric(id, { fields: ['*', { composition: ['*'] }] }));
}

export type GetFabricType = Awaited<ReturnType<typeof getFabric>>;

function doFilters(filters: FabricFilter) {
	return {
		...(filters.code && {
			code: {
				_contains: filters.code,
			},
		}),
		...(filters.name && {
			name: {
				_contains: filters.name,
			},
		}),
		...(filters.colors &&
			filters.colors.length > 0 && {
				color_id: {
					_in: filters.colors,
				},
			}),
		...(filters.suppliers &&
			filters.suppliers.length > 0 && {
				supplier_id: {
					_in: filters.suppliers,
				},
			}),
		...(filters.state && {
			delete_at: {
				_null: filters.state === 'Activo',
			},
		}),
	};
}
