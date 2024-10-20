import { queryOptions } from '@tanstack/solid-query';
import { aggregate } from '@vytex/client';
import { client } from '~/lib/client';

export function countUsersByStateQuery() {
	return queryOptions({
		queryKey: ['countUsersByState'],
		queryFn: () => countUsersByState(),
	});
}

async function countUsersByState() {
	return client.request(
		aggregate('vytex_users', {
			aggregate: {
				count: ['id', 'deleted_at'],
			},
		}),
	);
}

export type CountUsersByStateType = Awaited<ReturnType<typeof countUsersByState>>;

export function countUsersByRoleIdQuery() {
	return queryOptions({
		queryKey: ['countUsersByRoleId'],
		queryFn: () => countUsersByRoleId(),
	});
}

async function countUsersByRoleId() {
	return client.request(
		aggregate('vytex_users', {
			aggregate: {
				count: '*',
			},
			groupBy: ['role_id'],
		}),
	);
}

export function countRoleByCodeQuery() {
	return queryOptions({
		queryKey: ['countRoleByCode'],
		queryFn: () => countRoleByCode(),
	});
}

async function countRoleByCode() {
	return client.request(
		aggregate('vytex_roles', {
			aggregate: {
				count: '*',
			},
			groupBy: ['code'],
		}),
	);
}
