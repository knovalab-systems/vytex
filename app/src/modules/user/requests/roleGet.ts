import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readRole, readRoles } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getRolesQuery(page: number) {
	return queryOptions({
		queryFn: () => getRoles(page),
		queryKey: ['getRoles', page],
	});
}

async function getRoles(page: number) {
	return await client.request(
		readRoles({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'name', 'code'],
		}),
	);
}

export type GetRolesType = Awaited<ReturnType<typeof getRoles>>;

export function countRolesQuery() {
	return queryOptions({
		queryKey: ['countSuppliers'],
		queryFn: countRoles,
	});
}

async function countRoles() {
	return await client.request(
		aggregate('vytex_roles', {
			aggregate: {
				count: '*',
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
