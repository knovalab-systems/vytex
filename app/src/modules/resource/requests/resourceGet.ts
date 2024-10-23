import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readResource, readResources } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { ResourceFilter } from '~/types/filter';

export function getResourcesQuery(page: number, filters: ResourceFilter) {
	return queryOptions({
		queryKey: ['getResources', page, filters],
		queryFn: () => getResources(page, filters),
	});
}

async function getResources(page: number, filters: ResourceFilter) {
	return await client.request(
		readResources({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'name', 'cost', 'color_id', 'supplier_id', 'code', 'deleted_at'],
			...doFilters(filters),
		}),
	);
}

export type GetResourcesType = Awaited<ReturnType<typeof getResources>>;

export function countResourcesQuery(filters: ResourceFilter) {
	return queryOptions({
		queryKey: ['countResources', filters],
		queryFn: () => countResources(filters),
	});
}

async function countResources(filters: ResourceFilter) {
	return await client.request(
		aggregate('vytex_resources', {
			aggregate: {
				count: '*',
			},
			query: {
				...doFilters(filters),
			},
		}),
	);
}

export function getResourceQuery(id: number) {
	return queryOptions({
		queryFn: () => getResource(id),
		queryKey: ['getResource', id],
	});
}

async function getResource(id: number) {
	return await client.request(readResource(id));
}

export type GetResourceType = Awaited<ReturnType<typeof getResource>>;

function doFilters(filters: ResourceFilter) {
	if (Object.keys(filters).length === 0) {
		return;
	}
	return {
		filter: {
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
		},
	};
}
