import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readReferences } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getReferencesQuery(page: number) {
	return queryOptions({
		queryKey: ['getReference', page],
		queryFn: () => getReferences(page),
	});
}

async function getReferences(page: number) {
	return await client.request(
		readReferences({
			page: page,
			limit: QUERY_LIMIT,
			fields: ['id', 'code', 'created_at', 'deleted_at', 'created_by', 'front', 'back'],
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
