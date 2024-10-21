import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readReference, readReferences } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { ReferenceFilter } from '~/types/filter';

export function getReferencesQuery(page: number, filters: ReferenceFilter) {
	return queryOptions({
		queryKey: ['getReferences', page, filters],
		queryFn: () => getReferences(page, filters),
	});
}

async function getReferences(page: number, filters: ReferenceFilter) {
	return await client.request(
		readReferences({
			page: page,
			limit: QUERY_LIMIT,
			filter: doFilters(filters),
			fields: ['id', 'code', 'deleted_at', { colors: ['color_id'] }],
			deep: doDeep(filters),
		}),
	);
}

export function countReferencesQuery(filters: ReferenceFilter) {
	return queryOptions({
		queryKey: ['countReference', filters],
		queryFn: () => countReferences(filters),
	});
}

async function countReferences(filters: ReferenceFilter) {
	return await client.request(
		aggregate('vytex_references', {
			aggregate: {
				count: '*',
			},
			query: {
				filter: doFilters(filters),
				deep: doDeep(filters),
			},
		}),
	);
}

export type GetReferenceType = Awaited<ReturnType<typeof getReferences>>;

export function getReferenceForTimesQuery(key: number) {
	return queryOptions({
		queryKey: ['getReferenceForTimes', key],
		queryFn: () => getReferenceForTimes(key),
	});
}

async function getReferenceForTimes(key: number) {
	return await client.request(
		readReference(key, {
			fields: ['id', { time_by_task: ['*'] }],
		}),
	);
}

export type GetReferenceForTimesType = Awaited<ReturnType<typeof getReferenceForTimes>>;

export function getReferenceProSupervisorQuery(key: number) {
	return queryOptions({
		queryKey: ['getReferenceForTimes', key],
		queryFn: () => getReferenceProSupervisor(key),
	});
}

async function getReferenceProSupervisor(key: number) {
	return await client.request(
		readReference(key, {
			fields: ['id', { time_by_task: ['*'] }],
		}),
	);
}

export type GetReferenceProSupervisorType = Awaited<ReturnType<typeof getReferenceProSupervisor>>;

function doFilters(filters: ReferenceFilter) {
	return {
		...(filters.code && {
			code: {
				_contains: filters.code,
			},
		}),
		...(filters.state && {
			delete_at: {
				_null: filters.state === 'Activo',
			},
		}),
		...(filters.colors &&
			filters.colors.length > 0 && {
				colors: { color_id: { _in: filters.colors } },
			}),
	};
}

function doDeep(filters: ReferenceFilter) {
	return {
		...(filters.colors &&
			filters.colors.length > 0 && {
				colors: { _filter: { color_id: { _in: filters.colors } } },
			}),
	};
}
