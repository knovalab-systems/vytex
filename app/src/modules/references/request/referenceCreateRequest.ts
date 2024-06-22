import { queryOptions } from '@tanstack/solid-query';
import {
	type CoreSchema,
	type VytexCreateReference,
	createReference,
	readColors,
	readFabrics,
	readResources,
} from '@vytex/client';
import { client } from '~/utils/client';

export function getColorsByRefCreateQuery() {
	return queryOptions({
		queryFn: getColorsByRefCreate,
		queryKey: ['getColorsByRefCreate'],
	});
}

async function getColorsByRefCreate() {
	return await client.request(
		readColors({
			limit: -1,
		}),
	);
}

export type colorsByRefCreate = Awaited<ReturnType<typeof getColorsByRefCreate>>;

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
		}),
	);
}

export type ResourcesByRefCreate = Awaited<ReturnType<typeof getResourcesByRefCreate>>;

type Reference = Partial<VytexCreateReference<CoreSchema>>;

export async function createReferenceRequest(reference: Reference) {
	return await client.request(createReference(reference));
}
