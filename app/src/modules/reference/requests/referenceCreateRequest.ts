import { queryOptions } from '@tanstack/solid-query';
import { createReference, readFabrics, readResources } from '@vytex/client';
import { client } from '~/utils/client';
import type { ReferenceCreateRequest } from '../schemas/referenceCreateSchema';

export function getFabricsByRefCreateQuery() {
	return queryOptions({
		queryFn: getFabricsByRefCreate,
		queryKey: ['getFabricsByRefCreate'],
	});
}

async function getFabricsByRefCreate() {
	return await client.request(
		readFabrics({
			limit: -1,
			filter: {
				deleted_at: {
					_null: true,
				},
			},
		}),
	);
}

export type FabricsByRefCreate = Awaited<ReturnType<typeof getFabricsByRefCreate>>;

export function getResourcesByRefCreateQuery() {
	return queryOptions({
		queryFn: getResourcesByRefCreate,
		queryKey: ['getResourcesByRefCreate'],
	});
}

async function getResourcesByRefCreate() {
	return await client.request(
		readResources({
			limit: -1,
			filter: {
				deleted_at: {
					_null: true,
				},
			},
		}),
	);
}

export type ResourcesByRefCreate = Awaited<ReturnType<typeof getResourcesByRefCreate>>;

export async function createReferenceRequest(reference: ReferenceCreateRequest) {
	return await client.request(createReference(reference));
}
