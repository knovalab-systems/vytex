import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readReference, readReferenceImage, readReferences } from '@vytex/client';
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
			fields: ['id', 'code', 'deleted_at', { colors: ['color_id'] }],
			...doFilters(filters),
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
				...doFilters(filters),
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

export function getReferenceForSupervisorQuery(key: number) {
	return queryOptions({
		queryKey: ['getReferenceForSupervisor', key],
		queryFn: () => getReferenceForSupervisor(key),
	});
}

async function getReferenceForSupervisor(key: number) {
	return await client.request(
		readReference(key, {
			fields: [
				'front',
				'created_at',
				'code',
				{ time_by_task: ['*'] },
				{
					colors: ['id', 'color_id', { fabrics: ['*'] }, { resources: ['*'] }],
				},
				'operations',
				'pieces',
			],
		}),
	);
}

export type GetReferenceProSupervisorType = Awaited<ReturnType<typeof getReferenceForSupervisor>>;

export function getReferenceImageQuery(key: number) {
	return queryOptions({
		queryKey: ['getReferenceImage', key],
		queryFn: () => getReferenceImage(key),
	});
}

async function getReferenceImage(key: number) {
	return await client.request(readReferenceImage(key));
}

export type GetReferenceImageType = Awaited<ReturnType<typeof getReferenceImage>>;

function doFilters(filters: ReferenceFilter) {
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
			...(filters.state && {
				delete_at: {
					_null: filters.state === 'Activo',
				},
			}),
			...(filters.colors &&
				filters.colors.length > 0 && {
					colors: { color_id: { _in: filters.colors } },
				}),
		},
	};
}
