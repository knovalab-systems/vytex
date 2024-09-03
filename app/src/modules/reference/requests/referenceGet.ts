import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readReference, readReferences } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getReferencesQuery(page: number) {
	return queryOptions({
		queryKey: ['getReferences', page],
		queryFn: () => getReferences(page),
	});
}

async function getReferences(page: number) {
	return await client.request(
		readReferences({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'code', 'deleted_at'],
		}),
	);
}

export function countReferencesQuery() {
	return queryOptions({
		queryKey: ['countReference'],
		queryFn: () => countReferences(),
	});
}

async function countReferences() {
	return await client.request(
		aggregate('vytex_references', {
			aggregate: {
				count: '*',
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
