import { queryOptions } from '@tanstack/solid-query';
import { createReference, readFabrics, readResources } from '@vytex/client';
import { client } from '~/lib/client';
import type { Reference } from '~/schemas/core';

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
			fields: ['id', 'name'],
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
			fields: ['id', 'name'],
			filter: {
				deleted_at: {
					_null: true,
				},
			},
		}),
	);
}

export type ResourcesByRefCreate = Awaited<ReturnType<typeof getResourcesByRefCreate>>;

export async function createReferenceRequest(reference: Reference) {
	return await client.request(createReference(reference));
}
