import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readRole, readRoles } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { RoleFilter } from '~/types/filter';

export function getRolesQuery(page: number, filters: RoleFilter) {
	return queryOptions({
		queryFn: () => getRoles(page, filters),
		queryKey: ['getRoles', page, filters],
	});
}

async function getRoles(page: number, filters: RoleFilter) {
	return await client.request(
		readRoles({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'name', 'code'],
			filter: doFilters(filters),
		}),
	);
}

export type GetRolesType = Awaited<ReturnType<typeof getRoles>>;

export function countRolesQuery(filters: RoleFilter) {
	return queryOptions({
		queryKey: ['countSuppliers', filters],
		queryFn: () => countRoles(filters),
	});
}

async function countRoles(filters: RoleFilter) {
	return await client.request(
		aggregate('vytex_roles', {
			aggregate: {
				count: '*',
			},
			query: {
				filter: doFilters(filters),
			},
		}),
	);
}

export function getRoleQuery(id: string) {
	return queryOptions({
		queryFn: () => getRole(id),
		queryKey: ['getRole', id],
	});
}

async function getRole(id: string) {
	return await client.request(readRole(id, { fields: ['id', 'name', 'policies', 'code'] }));
}

export type GetRoleType = Awaited<ReturnType<typeof getRole>>;

function doFilters(filters: RoleFilter) {
	return {
		...(filters.origin && {
			code: {
				_null: filters.origin === 'Personalizado',
			},
		}),
		...(filters.name && {
			name: {
				_contains: filters.name,
			},
		}),
	};
}
